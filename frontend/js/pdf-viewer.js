// Enhanced PDF Viewer for HARV
// Supports multi-page viewing with navigation

let currentPDF = null;
let currentPage = 1;
let totalPages = 0;
let currentScale = 1.5;

async function openPDFViewer(docId, filename) {
    console.log('🔍 openPDFViewer called with:', { docId, filename });

    // Create modal overlay
    const modal = document.createElement('div');
    modal.id = 'pdf-viewer-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.9);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    `;

    modal.innerHTML = `
        <div style="width: 100%; max-width: 1200px; height: 95vh; background: white; border-radius: 8px; overflow: hidden; display: flex; flex-direction: column;">
            <!-- Header -->
            <div style="padding: 16px 24px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; background: #f9fafb;">
                <div>
                    <h2 style="margin: 0; font-size: 18px; font-weight: 600; color: #1f2937;">${escapeHtml(filename)}</h2>
                    <p style="margin: 4px 0 0 0; font-size: 14px; color: #6b7280;">PDF Document</p>
                </div>
                <button onclick="closePDFViewer()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280; padding: 8px; line-height: 1;">×</button>
            </div>

            <!-- Controls -->
            <div style="padding: 12px 24px; border-bottom: 1px solid #e5e7eb; display: flex; gap: 16px; align-items: center; background: #f9fafb;">
                <button id="pdf-prev-page" onclick="changePDFPage(-1)" style="padding: 8px 16px; background: #9CAA5A; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">← Previous</button>
                <span id="pdf-page-info" style="font-size: 14px; color: #374151; min-width: 120px; text-align: center;">Page 1 of 1</span>
                <button id="pdf-next-page" onclick="changePDFPage(1)" style="padding: 8px 16px; background: #9CAA5A; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">Next →</button>

                <div style="flex: 1;"></div>

                <button onclick="zoomPDF(-0.2)" style="padding: 8px 12px; background: #e5e7eb; border: none; border-radius: 6px; cursor: pointer;">−</button>
                <span id="pdf-zoom-level" style="font-size: 14px; color: #374151; min-width: 60px; text-align: center;">150%</span>
                <button onclick="zoomPDF(0.2)" style="padding: 8px 12px; background: #e5e7eb; border: none; border-radius: 6px; cursor: pointer;">+</button>

                <button onclick="downloadPDF(${docId}, '${escapeHtml(filename)}')" style="padding: 8px 16px; background: #C07047; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">Download</button>
            </div>

            <!-- PDF Canvas Container -->
            <div id="pdf-canvas-container" style="flex: 1; overflow: auto; padding: 24px; background: #e5e7eb; display: flex; justify-content: center; align-items: flex-start;">
                <div id="pdf-loading" style="text-align: center; padding: 40px;">
                    <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid #9CAA5A; border-radius: 50%; border-top-color: transparent; animation: spin 1s linear infinite;"></div>
                    <p style="margin-top: 16px; color: #6b7280;">Loading PDF...</p>
                </div>
                <canvas id="pdf-render-canvas" style="display: none; box-shadow: 0 4px 6px rgba(0,0,0,0.1); background: white;"></canvas>
            </div>
        </div>
    `;

    // Add to page
    document.body.appendChild(modal);

    // Add keypress handler for navigation
    document.addEventListener('keydown', handlePDFKeypress);

    // Load and render PDF
    await loadAndRenderPDF(docId);
}

async function loadAndRenderPDF(docId) {
    console.log('📄 Loading PDF for document ID:', docId);
    try {
        // Fetch PDF with auth - try both token names
        const headers = {};
        const token = localStorage.getItem('access_token') || localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
            console.log('🔑 Using token:', token.substring(0, 20) + '...');
        } else {
            console.warn('⚠️ No token found in localStorage');
        }

        console.log('🌐 Fetching from:', `http://localhost:8000/documents/${docId}/pdf`);
        const response = await fetch(`http://localhost:8000/documents/${docId}/pdf`, { headers });
        console.log('📥 Response status:', response.status);

        if (!response.ok) throw new Error('Failed to load PDF');

        // Get PDF as array buffer
        const pdfData = await response.arrayBuffer();

        // Use PDF.js to load document
        const pdfjsLib = window['pdfjs-dist/build/pdf'];
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const loadingTask = pdfjsLib.getDocument({ data: pdfData });
        currentPDF = await loadingTask.promise;
        totalPages = currentPDF.numPages;
        currentPage = 1;

        // Render first page
        await renderPDFPage(currentPage);

    } catch (error) {
        console.error('Error loading PDF:', error);
        document.getElementById('pdf-canvas-container').innerHTML = `
            <div style="text-align: center; padding: 40px; color: #ef4444;">
                <p style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Failed to Load PDF</p>
                <p style="font-size: 14px;">${error.message}</p>
            </div>
        `;
    }
}

async function renderPDFPage(pageNumber) {
    if (!currentPDF || pageNumber < 1 || pageNumber > totalPages) return;

    const canvas = document.getElementById('pdf-render-canvas');
    const loading = document.getElementById('pdf-loading');
    const context = canvas.getContext('2d');

    // Show loading
    loading.style.display = 'block';
    canvas.style.display = 'none';

    try {
        // Get the page
        const page = await currentPDF.getPage(pageNumber);

        // Calculate viewport
        const viewport = page.getViewport({ scale: currentScale });

        // Set canvas dimensions
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Render
        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;

        // Hide loading, show canvas
        loading.style.display = 'none';
        canvas.style.display = 'block';

        // Update UI
        document.getElementById('pdf-page-info').textContent = `Page ${pageNumber} of ${totalPages}`;
        document.getElementById('pdf-prev-page').disabled = pageNumber <= 1;
        document.getElementById('pdf-next-page').disabled = pageNumber >= totalPages;

    } catch (error) {
        console.error('Error rendering page:', error);
        loading.innerHTML = `<p style="color: #ef4444;">Error rendering page</p>`;
    }
}

function changePDFPage(delta) {
    const newPage = currentPage + delta;
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderPDFPage(currentPage);
    }
}

function zoomPDF(delta) {
    currentScale = Math.max(0.5, Math.min(3.0, currentScale + delta));
    document.getElementById('pdf-zoom-level').textContent = Math.round(currentScale * 100) + '%';
    renderPDFPage(currentPage);
}

function handlePDFKeypress(e) {
    if (!document.getElementById('pdf-viewer-modal')) return;

    if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        changePDFPage(-1);
        e.preventDefault();
    } else if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        changePDFPage(1);
        e.preventDefault();
    } else if (e.key === 'Escape') {
        closePDFViewer();
        e.preventDefault();
    }
}

async function downloadPDF(docId, filename) {
    try {
        const headers = {};
        const token = localStorage.getItem('access_token') || localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`http://localhost:8000/documents/${docId}/pdf`, { headers });
        const blob = await response.blob();

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading PDF:', error);
        alert('Failed to download PDF');
    }
}

function closePDFViewer() {
    const modal = document.getElementById('pdf-viewer-modal');
    if (modal) {
        document.removeEventListener('keydown', handlePDFKeypress);
        modal.remove();
    }
    currentPDF = null;
    currentPage = 1;
    totalPages = 0;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add CSS animation for loading spinner
if (!document.getElementById('pdf-viewer-styles')) {
    const style = document.createElement('style');
    style.id = 'pdf-viewer-styles';
    style.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        #pdf-viewer-modal button:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }
        #pdf-viewer-modal button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);
}
