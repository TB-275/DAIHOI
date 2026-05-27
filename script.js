// =========================================
// QUẢN LÝ NHẠC NỀN
// =========================================
function forcePlayMusic() {
    const music = document.getElementById('bg-music');
    if (music.paused) {
        music.play().catch(error => {
            console.log("Trình duyệt chặn phát nhạc, đang chờ tương tác...");
        });
    }
}
document.body.addEventListener('click', forcePlayMusic, { once: true });
document.body.addEventListener('touchstart', forcePlayMusic, { once: true });

// =========================================
// QUẢN LÝ SLIDE VÀ KHỞI TẠO
// =========================================
const slideImages = ['dnang.jpg', 'qnam.jpg'];
const track = document.getElementById('slideTrack');
let currentSlide = 0;

function initApp() {
    track.innerHTML = "";
    slideImages.forEach(image => {
        const slideDiv = document.createElement('div');
        slideDiv.classList.add('slide'); 
        slideDiv.style.backgroundImage = `url('${image}')`;
        track.appendChild(slideDiv);
    });

    setTimeout(() => {
        document.getElementById('intro-screen').classList.add('fade-out');
        document.getElementById('main-ui').classList.add('show');
        
        if (slideImages.length > 1) {
            setInterval(() => {
                currentSlide = (currentSlide + 1) % slideImages.length;
                track.style.transform = `translateX(-${currentSlide * 100}%)`;
            }, 4000);
        }
    }, 5000); 
}
initApp();

// =========================================
// DỮ LIỆU TÀI LIỆU (Chưa load vào bộ nhớ)
// =========================================
const documents = {
    doc1: { 
        title: "Tài liệu Đại hội", 
        images: [
            "hinhanh/nq1.webp", "hinhanh/nq2.webp", "hinhanh/qc1.webp", "hinhanh/qc2.webp",
            "hinhanh/ct1.webp", "hinhanh/ct2.webp", "hinhanh/bccc1.webp", "hinhanh/bccc2.webp",
            "hinhanh/bccc3.webp", "hinhanh/bccc4.webp", "hinhanh/bccc5.webp", "hinhanh/bccc6.webp",
            "hinhanh/bccc7.webp", "hinhanh/bccc8.webp", "hinhanh/bccc9.webp", "hinhanh/bccc10.webp",
            "hinhanh/bccc11.webp", "hinhanh/bccc12.webp", "hinhanh/bccc13.webp", "hinhanh/bccc14.webp",
            "hinhanh/bccc15.webp", "hinhanh/bccc16.webp", "hinhanh/bccc17.webp", "hinhanh/bccc18.webp",
            "hinhanh/bccc19.webp", "hinhanh/bccc20.webp", "hinhanh/bccc21.webp", "hinhanh/bccc22.webp",
            "hinhanh/bccc23.webp", "hinhanh/bccc24.webp", "hinhanh/bccc25.webp", "hinhanh/bccc26.webp",
            "hinhanh/bccc27.webp", "hinhanh/bccc28.webp"
        ]
    },
    doc2: { title: "Biểu trưng Đại Hội", html: `
        <div>
            <img id="anh-bieu-trung" src="hinhanh/bieutrung.webp" alt="Biểu trưng Đại Hội" style="width: 100%; border-radius: 8px;">

            <div id="video-bieu-trung" style="display: none; margin-top: 10px;">
               <iframe src="https://drive.google.com/file/d/1yksLf-pard4uUAh16bVNmnRV94YsUbf0/preview" width="100%" height="500px" allow="autoplay" frameborder="0"></iframe>
            </div>

            <div style="text-align: center; margin-top: 15px;">
                <span onclick="document.getElementById('anh-bieu-trung').style.display='none'; document.getElementById('video-bieu-trung').style.display='block'; this.style.display='none';" 
                      style="color: #007bff; text-decoration: underline; font-weight: bold; cursor: pointer; font-size: 16px;">
                    XEM VIDEO BIỂU TRƯNG
                </span>
            </div>
        </div>
    ` 
},  
    doc3: { 
        title: "Gương tiêu biểu", 
        images: Array.from({length: 19}, (_, i) => `hinhanh/bv${i+1}.webp`) // Gộp mảng cho gọn
    },
    doc4: { 
        title: "CLB Đội nhóm", 
        images: Array.from({length: 18}, (_, i) => `clb/${i+1}.webp`)
    },
    doc5: { title: "Ca khúc Đại Hội", html: `<iframe src="https://drive.google.com/file/d/14JQl3iAZ21YdA--CR6iNKHdVW6k4i63z/preview" width="100%" height="100%" allow="autoplay" frameborder="0"></iframe>`
    },
    doc7: { title: "Ca khúc Đại Hội", html: `<img src="ca khúc.jpg" alt="Trang1">` },
    doc8: { 
        title: "Hình nền điện thoại", 
        html: `<a class="original-download" href="hinhnendienthoai.jpg" download>Tải xuống ảnh gốc</a>
               <img src="hinhnendienthoai.jpg" alt="Trang1">` 
    },
    doc9: { 
        title: "Hình nền máy tính", 
        html: `<a class="original-download" href="hinhnenmaytinh.jpg" download>Tải xuống ảnh gốc</a>
               <img src="hinhnenmaytinh.jpg" alt="Trang1">` 
    }
};

// =========================================
// QUẢN LÝ POPUP & LOAD ON DEMAND TỐI ƯU
// =========================================
function showContent(docId) {
    const data = documents[docId];
    if (!data) return; // Bảo vệ mã nếu ID không tồn tại

    document.getElementById('content-title').innerText = data.title;
    
    // Khai báo các vùng chứa
    const docContent = document.getElementById('document-content');
    const docFrame = document.getElementById('document-frame');
    const videoContainer = document.getElementById('video-container');
    const videoPlayer = document.getElementById('video-player');
    const msgCreator = document.getElementById('message-creator'); 
    
    // 1. TẮT & LÀM SẠCH TẤT CẢ (Giải phóng bộ nhớ trang trước)
    docContent.style.display = 'none';
    docFrame.style.display = 'none';
    videoContainer.style.display = 'none';
    if(msgCreator) msgCreator.style.display = 'none';
    
    videoPlayer.src = "";
    docFrame.src = "";
    docContent.innerHTML = ""; 

    // 2. CHỈ TẢI VÀ BẬT NỘI DUNG ĐƯỢC YÊU CẦU CỤ THỂ
    if (docId === 'doc5' && msgCreator) {
        document.getElementById('content-title').innerText = "Tạo Thông Điệp Của Riêng Bạn";
        msgCreator.style.display = 'block';
    } 
    else if (data.video) {
        videoPlayer.src = data.video;
        videoContainer.style.display = 'flex';
    } 
    else if (data.html) {
        docContent.innerHTML = data.html;
        docContent.style.display = 'block';
    } 
    else if (data.images) {
        // Sinh khung HTML rỗng trước
        docContent.innerHTML = `<div class="vertical-reader" id="vertical-reader"></div>`;
        docContent.style.display = 'block';
        
        // Nhét thẻ img rỗng vào (chưa tải hình)
        const reader = document.getElementById('vertical-reader');
        data.images.forEach((imgSrc, index) => {
            reader.innerHTML += `
                <div class="image-wrapper">
                    <img data-src="${imgSrc}" class="lazy-image" alt="Trang ${index + 1}" loading="lazy">
                </div>
            `;
        });
        initLazyLoading(); // Kích hoạt Lazyload cho các thẻ vừa sinh
    } 
    else if (data.file) {
        docFrame.src = data.file;
        docFrame.style.display = 'block';
    }

    document.getElementById('content-display').classList.remove('hidden');
}

function closeContent() {
    document.getElementById('content-display').classList.add('hidden');
    
    // Tắt hoàn toàn bộ nhớ khi bấm nút "X"
    document.getElementById('video-player').src = "";
    document.getElementById('document-frame').src = ""; 
    document.getElementById('document-content').innerHTML = ""; 
    const msgCreator = document.getElementById('message-creator');
    if(msgCreator) msgCreator.style.display = 'none';
}

function initLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-image');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src; // Lệnh này mới chính thức yêu cầu tải ảnh
                img.onload = () => img.classList.add('loaded');
                obs.unobserve(img);
            }
        });
    }, { rootMargin: '300px' });

    lazyImages.forEach(img => observer.observe(img));
}

// =========================================
// QUẢN LÝ MENU CON
// =========================================
function showSubMenu(subMenuId) {
    document.getElementById('main-buttons').classList.add('hidden');
    document.getElementById(subMenuId).classList.remove('hidden');
}

function showMainMenu() {
    document.getElementById('clb-menu').classList.add('hidden');
    document.getElementById('main-buttons').classList.remove('hidden');
}

// =========================================
// XỬ LÝ KHUNG THÔNG ĐIỆP (Tùy chọn cho file thongdiep.html)
// =========================================
const inputName = document.getElementById('inputName');
if (inputName) {
    inputName.addEventListener('input', e => {
        document.getElementById('displayName').innerText = e.target.value || 'HUỲNH TRÒN';
    });
}

const inputRole = document.getElementById('inputRole');
if (inputRole) {
    inputRole.addEventListener('input', e => {
        document.getElementById('displayRole').innerText = e.target.value || 'Bí thư Chi đoàn';
    });
}

const inputMessage = document.getElementById('inputMessage');
if (inputMessage) {
    inputMessage.addEventListener('input', e => {
        const msgDiv = document.getElementById('displayMessage');
        const boxDiv = document.querySelector('.white-message-box');
        
        msgDiv.innerText = e.target.value || 'Chúc Đại hội thành công rực rỡ!';
        
        let currentSize = 2.8; 
        msgDiv.style.fontSize = currentSize + 'cqw';
        
        while (msgDiv.scrollHeight > boxDiv.clientHeight && currentSize > 1.0) {
            currentSize -= 0.1;
            msgDiv.style.fontSize = currentSize + 'cqw';
        }
    });
}

const uploadAvatar = document.getElementById('uploadAvatar');
if (uploadAvatar) {
    uploadAvatar.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = event => document.getElementById('displayAvatar').src = event.target.result;
            reader.readAsDataURL(file);
        }
    });
}

function downloadImage() {
    const captureDiv = document.getElementById('capture-area');
    const btn = document.querySelector('.btn-download');
    
    if(!captureDiv) return;
    
    btn.innerText = "Đang kết xuất ảnh nét cao...";
    btn.disabled = true;

    html2canvas(captureDiv, { 
        useCORS: true, 
        scale: 5, 
        backgroundColor: null,
        logging: false 
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'Thong-Diep-Dai-Hoi-In-An.png';
        link.href = canvas.toDataURL('image/png', 1.0); 
        link.click();
        
        btn.innerText = "Tải lời nhắn về";
        btn.disabled = false;
    }).catch(err => {
        console.error("Lỗi xuất ảnh:", err);
        alert("Có lỗi xảy ra, vui lòng thử lại!");
        btn.innerText = "Tải lời nhắn về";
        btn.disabled = false;
    });
}