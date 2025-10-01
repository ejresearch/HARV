"""
Document Management Endpoints for Admin
Handles file uploads and document storage
"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import Response
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional
from datetime import datetime
import os
import base64

from app.database import get_db
from app.models import Document, Module, User
from app.auth import require_admin

router = APIRouter()


@router.get("/documents")
def get_documents(
    module_id: Optional[int] = None,
    admin_user: User = Depends(require_admin()),
    db: Session = Depends(get_db)
):
    """Get all documents, optionally filtered by module"""

    query = db.query(Document)
    if module_id is not None:
        query = query.filter(Document.module_id == module_id)

    documents = query.order_by(desc(Document.uploaded_at)).all()

    return {
        "documents": [{
            "id": d.id,
            "filename": d.filename,
            "module_id": d.module_id,
            "user_id": d.user_id,
            "content_preview": d.content[:200] if d.content else None,
            "content_length": len(d.content) if d.content else 0,
            "uploaded_at": d.uploaded_at.isoformat() if d.uploaded_at else None
        } for d in documents]
    }


@router.get("/documents/{document_id}")
def get_document(
    document_id: int,
    admin_user: User = Depends(require_admin()),
    db: Session = Depends(get_db)
):
    """Get full document content"""

    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    return {
        "id": document.id,
        "filename": document.filename,
        "module_id": document.module_id,
        "user_id": document.user_id,
        "content": document.content,
        "uploaded_at": document.uploaded_at.isoformat() if document.uploaded_at else None
    }


@router.post("/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    module_id: Optional[int] = Form(None),
    admin_user: User = Depends(require_admin()),
    db: Session = Depends(get_db)
):
    """Upload a new document"""

    # Verify module exists if provided
    if module_id is not None:
        module = db.query(Module).filter(Module.id == module_id).first()
        if not module:
            raise HTTPException(status_code=404, detail="Module not found")

    # Validate file type
    allowed_extensions = ['.txt', '.md', '.pdf', '.doc', '.docx']
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed types: {', '.join(allowed_extensions)}"
        )

    # Read file content
    content = await file.read()

    # Handle different file types
    if file_ext in ['.txt', '.md']:
        try:
            text_content = content.decode('utf-8')
        except UnicodeDecodeError:
            raise HTTPException(status_code=400, detail="Unable to decode text file")
    elif file_ext == '.pdf':
        # For PDF, store base64 encoded content
        import base64
        text_content = f"[PDF_BASE64]{base64.b64encode(content).decode('utf-8')}"
    else:
        # For other file types, store metadata
        text_content = f"[DOCUMENT FILE: {file.filename}]\nContent type: {file.content_type}"

    # Limit content size (10MB text limit)
    if len(text_content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File content too large (max 10MB)")

    # Create document record
    new_document = Document(
        filename=file.filename,
        content=text_content,
        module_id=module_id,
        user_id=admin_user.id
    )

    db.add(new_document)
    db.commit()
    db.refresh(new_document)

    return {
        "id": new_document.id,
        "filename": new_document.filename,
        "module_id": new_document.module_id,
        "content_length": len(text_content),
        "uploaded_at": new_document.uploaded_at.isoformat() if new_document.uploaded_at else None,
        "message": "Document uploaded successfully"
    }


@router.delete("/documents/{document_id}")
def delete_document(
    document_id: int,
    admin_user: User = Depends(require_admin()),
    db: Session = Depends(get_db)
):
    """Delete a document"""

    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    filename = document.filename
    db.delete(document)
    db.commit()

    return {
        "message": f"Document '{filename}' deleted successfully",
        "id": document_id
    }


@router.get("/documents/module/{module_id}/summary")
def get_module_documents_summary(
    module_id: int,
    admin_user: User = Depends(require_admin()),
    db: Session = Depends(get_db)
):
    """Get summary of documents for a specific module"""

    # Verify module exists
    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    documents = db.query(Document).filter(Document.module_id == module_id).all()

    total_size = sum(len(d.content) if d.content else 0 for d in documents)

    return {
        "module_id": module_id,
        "module_title": module.title,
        "document_count": len(documents),
        "total_content_size": total_size,
        "documents": [{
            "id": d.id,
            "filename": d.filename,
            "uploaded_at": d.uploaded_at.isoformat() if d.uploaded_at else None
        } for d in documents]
    }


@router.get("/documents/{document_id}/pdf")
def get_document_pdf(
    document_id: int,
    admin_user: User = Depends(require_admin()),
    db: Session = Depends(get_db)
):
    """Get PDF file as binary for viewing"""

    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    # Check if it's a PDF with base64 content
    if document.content.startswith("[PDF_BASE64]"):
        pdf_base64 = document.content.replace("[PDF_BASE64]", "")
        pdf_bytes = base64.b64decode(pdf_base64)

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"inline; filename={document.filename}"}
        )
    else:
        raise HTTPException(status_code=400, detail="Document is not a PDF")
