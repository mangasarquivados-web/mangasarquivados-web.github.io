// Dados dos vídeos (com links que funcionam!)
const defaultVideos = [
    {
        id: 1,
        title: "Tutorial de HTML para Iniciantes",
        description: "Aprenda HTML do zero neste tutorial completo para iniciantes.",
        thumbnail: "https://img.youtube.com/vi/4dQtz1PpY9A/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/embed/4dQtz1PpY9A",
        duration: "15:30",
        views: "1.2M",
        date: "2024-01-15",
        category: "Tutorial",
        type: "youtube"
    },
    {
        id: 2,
        title: "Natureza Relaxante - 4K",
        description: "Paisagens naturais incríveis para relaxar e estudar.",
        thumbnail: "https://img.youtube.com/vi/1-xGerv5FOk/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/embed/1-xGerv5FOk",
        duration: "1:23:45",
        views: "5.7M",
        date: "2024-01-10",
        category: "Natureza",
        type: "youtube"
    },
    {
        id: 3,
        title: "Música para Programar",
        description: "Playlist com músicas ideais para focar na programação.",
        thumbnail: "https://img.youtube.com/vi/2OEL4PPGNVw/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/embed/2OEL4PPGNVw",
        duration: "2:15:30",
        views: "3.4M",
        date: "2024-01-05",
        category: "Música",
        type: "youtube"
    },
    {
        id: 4,
        title: "Exercícios em Casa",
        description: "Rotina completa de exercícios para fazer em casa.",
        thumbnail: "https://img.youtube.com/vi/MLrA6wP5T5U/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/embed/MLrA6wP5T5U",
        duration: "25:45",
        views: "890K",
        date: "2023-12-20",
        category: "Fitness",
        type: "youtube"
    }
];

// Gerenciamento de vídeos
class VideoManager {
    constructor() {
        this.videos = this.loadVideosFromStorage();
        if (this.videos.length === 0) {
            this.videos = [...defaultVideos];
            this.saveVideosToStorage();
        }
    }

    loadVideosFromStorage() {
        try {
            const saved = localStorage.getItem('userVideos');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Erro ao carregar vídeos:', e);
            return [];
        }
    }

    saveVideosToStorage() {
        try {
            localStorage.setItem('userVideos', JSON.stringify(this.videos));
        } catch (e) {
            console.error('Erro ao salvar vídeos:', e);
        }
    }

    addVideo(videoData) {
        const newVideo = {
            id: Date.now(),
            ...videoData,
            views: "0",
            date: new Date().toISOString().split('T')[0]
        };
        this.videos.unshift(newVideo);
        this.saveVideosToStorage();
        return newVideo;
    }

    getVideoById(id) {
        return this.videos.find(video => video.id == id);
    }

    getAllVideos() {
        return [...this.videos];
    }

    searchVideos(query) {
        if (!query.trim()) return this.getAllVideos();
        
        const searchTerm = query.toLowerCase();
        return this.videos.filter(video => 
            video.title.toLowerCase().includes(searchTerm) ||
            video.description.toLowerCase().includes(searchTerm) ||
            video.category.toLowerCase().includes(searchTerm)
        );
    }
}

// Inicializar gerenciador
const videoManager = new VideoManager();

// Funções da página inicial
function loadVideos() {
    const container = document.getElementById('videoContainer');
    const loading = document.getElementById('loading');
    const noVideos = document.getElementById('noVideos');
    
    if (!container) return;
    
    container.innerHTML = '';
    loading.style.display = 'block';
    noVideos.style.display = 'none';
    
    // Simular carregamento
    setTimeout(() => {
        const videos = videoManager.getAllVideos();
        
        if (videos.length === 0) {
            loading.style.display = 'none';
            noVideos.style.display = 'block';
            return;
        }
        
        videos.forEach(video => {
            const videoCard = createVideoCard(video);
            container.appendChild(videoCard);
        });
        
        loading.style.display = 'none';
    }, 500);
}

function createVideoCard(video) {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.dataset.id = video.id;
    
    card.innerHTML = `
        <div class="video-thumbnail">
            <img src="${video.thumbnail}" alt="${video.title}" 
                 onerror="this.src='https://via.placeholder.com/300x180/2f3542/ffffff?text=Thumbnail'">
            <div class="video-duration">${video.duration}</div>
        </div>
        <div class="video-info">
            <h3 class="video-title">${video.title}</h3>
            <div class="video-meta">
                <span>${video.views} visualizações</span>
                <span>${formatDate(video.date)}</span>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => {
        watchVideo(video.id);
    });
    
    return card;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `Há ${diffDays} dias`;
    if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)} semanas`;
    return `Há ${Math.floor(diffDays / 30)} meses`;
}

function watchVideo(videoId) {
    // Salvar no sessionStorage para a página do player
    sessionStorage.setItem('currentVideoId', videoId);
    window.location.href = `player.html?id=${videoId}`;
}

function searchVideos() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    
    const query = input.value;
    const videos = videoManager.searchVideos(query);
    const container = document.getElementById('videoContainer');
    const noVideos = document.getElementById('noVideos');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (videos.length === 0) {
        noVideos.style.display = 'block';
        return;
    }
    
    noVideos.style.display = 'none';
    videos.forEach(video => {
        const videoCard = createVideoCard(video);
        container.appendChild(videoCard);
    });
}

function showMyVideos() {
    const videos = videoManager.getAllVideos();
    const userVideos = videos.filter(v => v.type === 'user');
    
    const container = document.getElementById('videoContainer');
    const noVideos = document.getElementById('noVideos');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (userVideos.length === 0) {
        noVideos.style.display = 'block';
        noVideos.innerHTML = `
            <i class="fas fa-video-slash"></i>
            <h3>Você ainda não tem vídeos</h3>
            <button class="btn-primary" onclick="window.location.href='upload.html'">
                <i class="fas fa-plus"></i> Adicionar Primeiro Vídeo
            </button>
        `;
        return;
    }
    
    noVideos.style.display = 'none';
    userVideos.forEach(video => {
        const videoCard = createVideoCard(video);
        container.appendChild(videoCard);
    });
}

// Funções da página do player
function loadPlayerPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id') || sessionStorage.getItem('currentVideoId');
    
    if (!videoId) {
        window.location.href = 'index.html';
        return;
    }
    
    const video = videoManager.getVideoById(videoId);
    
    if (!video) {
        document.body.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h2>Vídeo não encontrado</h2>
                <button onclick="window.location.href='index.html'" class="btn-primary">
                    Voltar para a página inicial
                </button>
            </div>
        `;
        return;
    }
    
    // Atualizar a página com os dados do vídeo
    document.title = `${video.title} - MeuVideoSite`;
    
    const player = document.getElementById('videoPlayer');
    const titleElement = document.getElementById('videoTitle');
    const descElement = document.getElementById('videoDescription');
    const viewsElement = document.getElementById('videoViews');
    const dateElement = document.getElementById('videoDate');
    
    if (player) {
        if (video.type === 'youtube' || video.videoUrl.includes('youtube.com/embed')) {
            // YouTube
            player.innerHTML = `
                <iframe 
                    src="${video.videoUrl}?autoplay=1&rel=0" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            `;
        } else if (video.videoUrl.includes('drive.google.com')) {
            // Google Drive
            const driveId = extractDriveId(video.videoUrl);
            if (driveId) {
                player.innerHTML = `
                    <iframe 
                        src="https://drive.google.com/file/d/${driveId}/preview" 
                        frameborder="0" 
                        allow="autoplay"
                        allowfullscreen>
                    </iframe>
                `;
            }
        } else {
            // Vídeo direto
            player.innerHTML = `
                <video controls autoplay style="width:100%; height:100%;">
                    <source src="${video.videoUrl}" type="video/mp4">
                    Seu navegador não suporta vídeos HTML5.
                </video>
            `;
        }
    }
    
    // Atualizar informações do vídeo
    if (titleElement) titleElement.textContent = video.title;
    if (descElement) descElement.textContent = video.description;
    if (viewsElement) viewsElement.textContent = `${video.views} visualizações`;
    if (dateElement) dateElement.textContent = `Publicado em ${formatDate(video.date)}`;
    
    // Carregar vídeos relacionados
    loadRelatedVideos(video.id);
}

function extractDriveId(url) {
    const match = url.match(/\/d\/([^\/]+)/);
    return match ? match[1] : null;
}

function loadRelatedVideos(currentVideoId) {
    const container = document.getElementById('relatedVideos');
    if (!container) return;
    
    const videos = videoManager.getAllVideos()
        .filter(v => v.id != currentVideoId)
        .slice(0, 4);
    
    container.innerHTML = '';
    
    videos.forEach(video => {
        const videoCard = createVideoCard(video);
        container.appendChild(videoCard);
    });
}

// Funções da página de upload
function loadUploadPage() {
    const form = document.getElementById('uploadForm');
    const successMsg = document.getElementById('successMessage');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('videoTitle').value;
        const description = document.getElementById('videoDescription').value;
        const category = document.getElementById('videoCategory').value;
        const thumbnail = document.getElementById('videoThumbnail').value || 
                         'https://via.placeholder.com/300x180/2f3542/ffffff?text=Sem+Thumbnail';
        let videoUrl = document.getElementById('videoUrl').value;
        
        // Converter URL do YouTube se necessário
        if (videoUrl.includes('youtube.com/watch')) {
            videoUrl = convertYoutubeUrl(videoUrl);
        }
        
        const videoData = {
            title,
            description,
            category,
            thumbnail,
            videoUrl,
            duration: "10:00",
            type: 'user'
        };
        
        const newVideo = videoManager.addVideo(videoData);
        
        // Mostrar mensagem de sucesso
        if (successMsg) {
            successMsg.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <strong>Vídeo adicionado com sucesso!</strong>
                <p>"${title}" foi adicionado à sua biblioteca.</p>
            `;
            successMsg.style.display = 'block';
            
            // Redirecionar após 2 segundos
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
        
        // Limpar formulário
        form.reset();
    });
}

function convertYoutubeUrl(url) {
    // Converter de https://youtube.com/watch?v=ID para https://youtube.com/embed/ID
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url;
}

// Inicialização baseada na página atual
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    const page = path.split('/').pop();
    
    if (page === 'index.html' || page === '' || page.includes('.github.io')) {
        // Página inicial já é carregada automaticamente
    } else if (page === 'player.html') {
        loadPlayerPage();
    } else if (page === 'upload.html') {
        loadUploadPage();
    }
});
