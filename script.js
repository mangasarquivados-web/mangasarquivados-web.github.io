// Adicione esta função no início do script.js
function processVideoUrl(url) {
    // Se for um link do Google Drive
    if (url.includes('drive.google.com')) {
        // Extrair o ID do arquivo
        const match = url.match(/\/d\/([^\/]+)/);
        if (match && match[1]) {
            return `https://drive.google.com/uc?export=download&id=${match[1]}`;
        }
    }
    return url;
}

// Modifique a função initUploadPage (ou onde processa uploads):
function initUploadPage() {
    const uploadForm = document.getElementById('uploadForm');
    const successMessage = document.getElementById('successMessage');
    
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const category = document.getElementById('category').value;
        const thumbnail = document.getElementById('thumbnail').value || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
        let videoUrl = document.getElementById('videoUrl').value;
        
        // Processar URL do Google Drive
        videoUrl = processVideoUrl(videoUrl);
        
        // Resto do código permanece o mesmo...
    });
}
// Dados dos vídeos (simulando um banco de dados)
let videos = [
    {
        id: 1,
        title: "Tutorial de GitHub Pages para Iniciantes",
        description: "Aprenda a hospedar seu site gratuitamente no GitHub Pages passo a passo.",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://www.youtube.com/embed/8hrJ4oN1u_8",
        duration: "15:30",
        views: "1.2K",
        date: "Há 3 dias",
        category: "Tutorial"
    },
    {
        id: 2,
        title: "HTML, CSS e JavaScript - Fundamentos",
        description: "Conheça os três pilares do desenvolvimento web frontend.",
        thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://www.youtube.com/embed/i6L2jLHV9j8",
        duration: "22:45",
        views: "3.4K",
        date: "Há 1 semana",
        category: "Programação"
    },
    {
        id: 3,
        title: "Paisagens Naturais Incríveis 4K",
        description: "Relaxe com essas imagens deslumbrantes da natureza.",
        thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://www.youtube.com/embed/1-xGerv5FOk",
        duration: "8:15",
        views: "5.7K",
        date: "Há 2 semanas",
        category: "Natureza"
    },
    {
        id: 4,
        title: "Receita Fácil de Bolo de Chocolate",
        description: "Aprenda a fazer um delicioso bolo de chocolate em casa.",
        thumbnail: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://www.youtube.com/embed/17ghJ8Srsmo",
        duration: "12:22",
        views: "2.1K",
        date: "Há 1 mês",
        category: "Culinária"
    },
    {
        id: 5,
        title: "Exercícios em Casa sem Equipamento",
        description: "Mantenha-se em forma com essa rotina de exercícios em casa.",
        thumbnail: "https://images.unsplash.com/photo-1549060279-7e168fce7090?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://www.youtube.com/embed/MLrA6wP5T5U",
        duration: "18:40",
        views: "4.3K",
        date: "Há 2 meses",
        category: "Fitness"
    },
    {
        id: 6,
        title: "Como Tocar Violão - Aula 1",
        description: "Primeiros passos para aprender a tocar violão.",
        thumbnail: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://www.youtube.com/embed/C6CeA6hDg_M",
        duration: "25:10",
        views: "6.8K",
        date: "Há 3 meses",
        category: "Música"
    }
];

// Carregar vídeos quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Verificar em qual página estamos
    const path = window.location.pathname;
    const page = path.split('/').pop();
    
    if (page === 'index.html' || page === '' || page.endsWith('.github.io')) {
        // Página principal
        initHomePage();
    } else if (page === 'player.html') {
        // Página do player
        initPlayerPage();
    } else if (page === 'upload.html') {
        // Página de upload
        initUploadPage();
    }
});

// Função para a página inicial
function initHomePage() {
    const videoGrid = document.getElementById('videoGrid');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const myVideosBtn = document.getElementById('myVideosBtn');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const emptyState = document.getElementById('emptyState');
    
    // Carregar vídeos do localStorage se existirem
    const savedVideos = localStorage.getItem('userVideos');
    if (savedVideos) {
        const userVideos = JSON.parse(savedVideos);
        videos = [...videos, ...userVideos];
    }
    
    // Renderizar vídeos
    renderVideos(videos);
    
    // Evento de busca
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch();
    });
    
    // Evento para "Meus vídeos"
    myVideosBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const userVideos = JSON.parse(localStorage.getItem('userVideos') || '[]');
        if (userVideos.length > 0) {
            renderVideos(userVideos);
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        } else {
            alert('Você ainda não tem vídeos. Faça upload primeiro!');
            window.location.href = 'upload.html';
        }
    });
    
    // Eventos para filtros
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.textContent;
            let filteredVideos = [...videos];
            
            if (filter === 'Mais recentes') {
                filteredVideos.sort((a, b) => b.id - a.id);
            } else if (filter === 'Mais vistos') {
                filteredVideos.sort((a, b) => {
                    const viewsA = parseFloat(a.views.replace('K', '000').replace(' visualizações', ''));
                    const viewsB = parseFloat(b.views.replace('K', '000').replace(' visualizações', ''));
                    return viewsB - viewsA;
                });
            }
            
            renderVideos(filteredVideos);
        });
    });
    
    function performSearch() {
        const query = searchInput.value.toLowerCase();
        if (!query) {
            renderVideos(videos);
            emptyState.style.display = 'none';
            return;
        }
        
        const filtered = videos.filter(video => 
            video.title.toLowerCase().includes(query) || 
            video.description.toLowerCase().includes(query) ||
            video.category.toLowerCase().includes(query)
        );
        
        renderVideos(filtered);
        
        if (filtered.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
        }
    }
    
    function renderVideos(videosToRender) {
        videoGrid.innerHTML = '';
        
        if (videosToRender.length === 0) {
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        
        videosToRender.forEach(video => {
            const videoCard = document.createElement('div');
            videoCard.className = 'video-card';
            videoCard.innerHTML = `
                <div class="video-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
                    <div class="video-duration">${video.duration}</div>
                </div>
                <div class="video-info">
                    <h3 class="video-title">${video.title}</h3>
                    <div class="video-meta">
                        <span>${video.views} visualizações</span>
                        <span>${video.date}</span>
                    </div>
                </div>
            `;
            
            videoCard.addEventListener('click', () => {
                // Salvar o vídeo selecionado no localStorage para a página do player
                localStorage.setItem('selectedVideo', JSON.stringify(video));
                window.location.href = `player.html?id=${video.id}`;
            });
            
            videoGrid.appendChild(videoCard);
        });
    }
}

// Função para a página do player
function initPlayerPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id');
    
    // Buscar vídeo selecionado
    let video;
    const savedVideo = localStorage.getItem('selectedVideo');
    
    if (savedVideo) {
        video = JSON.parse(savedVideo);
    } else {
        // Fallback: buscar pelo ID
        video = videos.find(v => v.id == videoId) || videos[0];
    }
    
    // Atualizar a página com os dados do vídeo
    document.title = `${video.title} - Meu YouTube Pessoal`;
    
    const videoPlayer = document.getElementById('mainVideo');
    const videoTitle = document.getElementById('videoTitle');
    const videoDescription = document.getElementById('videoDescription');
    const videoViews = document.getElementById('videoViews');
    const videoDate = document.getElementById('videoDate');
    
    if (videoPlayer) {
        // Usar iframe para incorporar vídeos do YouTube/Vimeo
        if (video.videoUrl.includes('youtube.com/embed') || video.videoUrl.includes('vimeo.com')) {
            videoPlayer.innerHTML = `<iframe src="${video.videoUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        } else {
            // Para vídeos diretos (MP4)
            videoPlayer.innerHTML = `<video controls src="${video.videoUrl}" poster="${video.thumbnail}"></video>`;
        }
    }
    
    if (videoTitle) videoTitle.textContent = video.title;
    if (videoDescription) videoDescription.textContent = video.description;
    if (videoViews) videoViews.textContent = `${video.views} visualizações`;
    if (videoDate) videoDate.textContent = video.date;
    
    // Renderizar vídeos relacionados
    const relatedGrid = document.getElementById('relatedVideos');
    if (relatedGrid) {
        const relatedVideos = videos.filter(v => v.id !== video.id).slice(0, 4);
        relatedVideos.forEach(relatedVideo => {
            const videoCard = document.createElement('div');
            videoCard.className = 'video-card';
            videoCard.innerHTML = `
                <div class="video-thumbnail">
                    <img src="${relatedVideo.thumbnail}" alt="${relatedVideo.title}" loading="lazy">
                    <div class="video-duration">${relatedVideo.duration}</div>
                </div>
                <div class="video-info">
                    <h3 class="video-title">${relatedVideo.title}</h3>
                    <div class="video-meta">
                        <span>${relatedVideo.views}</span>
                        <span>${relatedVideo.date}</span>
                    </div>
                </div>
            `;
            
            videoCard.addEventListener('click', () => {
                localStorage.setItem('selectedVideo', JSON.stringify(relatedVideo));
                window.location.href = `player.html?id=${relatedVideo.id}`;
            });
            
            relatedGrid.appendChild(videoCard);
        });
    }
    
    // Botão voltar
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.history.back();
        });
    }
}

// Função para a página de upload
function initUploadPage() {
    const uploadForm = document.getElementById('uploadForm');
    const successMessage = document.getElementById('successMessage');
    
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const category = document.getElementById('category').value;
        const thumbnail = document.getElementById('thumbnail').value || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
        const videoUrl = document.getElementById('videoUrl').value;
        
        // Criar novo vídeo
        const newVideo = {
            id: Date.now(), // ID único baseado no timestamp
            title,
            description,
            thumbnail,
            videoUrl,
            duration: "10:00", // Duração padrão
            views: "0",
            date: "Agora mesmo",
            category
        };
        
        // Salvar no localStorage
        let userVideos = JSON.parse(localStorage.getItem('userVideos') || '[]');
        userVideos.push(newVideo);
        localStorage.setItem('userVideos', JSON.stringify(userVideos));
        
        // Mostrar mensagem de sucesso
        successMessage.style.display = 'block';
        successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <strong>Vídeo enviado com sucesso!</strong>
            <p>Seu vídeo "${title}" está disponível na sua biblioteca.</p>
        `;
        
        // Limpar formulário
        uploadForm.reset();
        
        // Redirecionar após 3 segundos
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    });
    
    // Botão cancelar
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
}

// Função para simular views (a cada visualização, aumentar contador)
function incrementViews(videoId) {
    let userVideos = JSON.parse(localStorage.getItem('userVideos') || '[]');
    const videoIndex = userVideos.findIndex(v => v.id == videoId);
    
    if (videoIndex !== -1) {
        let views = parseInt(userVideos[videoIndex].views) || 0;
        userVideos[videoIndex].views = (views + 1).toString();
        localStorage.setItem('userVideos', JSON.stringify(userVideos));
    }
}
