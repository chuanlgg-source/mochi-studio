/* ==========================================================================
   Mochi Studio — App Logic (Supabase Auth + Remember ID + Image Board)
   ========================================================================== */

(() => {
  'use strict';

  const STORAGE_KEYS = {
    REMEMBER_ID: 'mochi_saved_user_id',
    SB_CONFIG: 'mochi_sb_config',
    DEMO_USER: 'mochi_demo_user',
    DEMO_POSTS: 'mochi_demo_posts',
    DEMO_LIKES: 'mochi_demo_likes'
  };

  // Cute Vector Character Avatars (Inline SVG)
  const AVATAR_SVGS = {
    mochi: `
      <svg viewBox="0 0 40 40" width="28" height="28" fill="none">
        <circle cx="20" cy="20" r="18" fill="#FEF6D8"/>
        <path d="M20 7C20 7 23 4 25 6C27 8 23 11 20 10" stroke="#10B981" stroke-width="2" stroke-linecap="round"/>
        <ellipse cx="20" cy="23" rx="11" ry="9.5" fill="#FFFDF9" stroke="#18181B" stroke-width="2"/>
        <circle cx="16" cy="22" r="1.5" fill="#18181B"/>
        <circle cx="24" cy="22" r="1.5" fill="#18181B"/>
        <ellipse cx="13.5" cy="24.5" rx="2" ry="1.2" fill="#FFB4A2"/>
        <ellipse cx="26.5" cy="24.5" rx="2" ry="1.2" fill="#FFB4A2"/>
        <path d="M18 25Q20 27 22 25" stroke="#18181B" stroke-width="1.6" stroke-linecap="round"/>
      </svg>`,
    kiki: `
      <svg viewBox="0 0 40 40" width="28" height="28" fill="none">
        <circle cx="20" cy="20" r="18" fill="#FFF0EC"/>
        <circle cx="12" cy="14" r="4" fill="#FFFDF9" stroke="#18181B" stroke-width="1.8"/>
        <circle cx="28" cy="14" r="4" fill="#FFFDF9" stroke="#18181B" stroke-width="1.8"/>
        <ellipse cx="20" cy="23" rx="10.5" ry="9.5" fill="#FFFDF9" stroke="#18181B" stroke-width="2"/>
        <circle cx="16.5" cy="22" r="1.5" fill="#18181B"/>
        <circle cx="23.5" cy="22" r="1.5" fill="#18181B"/>
        <ellipse cx="14" cy="24.5" rx="1.8" ry="1.1" fill="#FFB4A2"/>
        <ellipse cx="26" cy="24.5" rx="1.8" ry="1.1" fill="#FFB4A2"/>
        <path d="M18.5 25Q20 26.8 21.5 25" stroke="#18181B" stroke-width="1.6" stroke-linecap="round"/>
      </svg>`,
    dubu: `
      <svg viewBox="0 0 40 40" width="28" height="28" fill="none">
        <circle cx="20" cy="20" r="18" fill="#ECFDF5"/>
        <rect x="10" y="12" width="20" height="18" rx="7" fill="#FFFDF9" stroke="#18181B" stroke-width="2"/>
        <circle cx="16" cy="20.5" r="1.5" fill="#18181B"/>
        <circle cx="24" cy="20.5" r="1.5" fill="#18181B"/>
        <ellipse cx="13.5" cy="23" rx="2" ry="1.2" fill="#FFB4A2"/>
        <ellipse cx="26.5" cy="23" rx="2" ry="1.2" fill="#FFB4A2"/>
        <path d="M18 24H22" stroke="#18181B" stroke-width="1.6" stroke-linecap="round"/>
      </svg>`,
    choco: `
      <svg viewBox="0 0 40 40" width="28" height="28" fill="none">
        <circle cx="20" cy="20" r="18" fill="#F3E8FF"/>
        <circle cx="12.5" cy="14.5" r="4" fill="#D6A984" stroke="#18181B" stroke-width="1.8"/>
        <circle cx="27.5" cy="14.5" r="4" fill="#D6A984" stroke="#18181B" stroke-width="1.8"/>
        <ellipse cx="20" cy="23" rx="10.5" ry="9.5" fill="#E6C3A5" stroke="#18181B" stroke-width="2"/>
        <circle cx="16.5" cy="21.5" r="1.5" fill="#18181B"/>
        <circle cx="23.5" cy="21.5" r="1.5" fill="#18181B"/>
        <ellipse cx="20" cy="24" rx="2.6" ry="1.8" fill="#FFFDF9"/>
        <circle cx="20" cy="23.5" r="1" fill="#18181B"/>
      </svg>`
  };

  function svgToDataUri(svgStr) {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svgStr.trim());
  }

  // Built-in Cute Vector Illustrations for Sample Posts
  const SAMPLE_IMAGES = {
    desk: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">
        <rect width="640" height="400" fill="#FEF6D8"/>
        <circle cx="530" cy="82" r="48" fill="#FFD3C8" opacity="0.7"/>
        <rect x="130" y="250" width="380" height="22" rx="11" fill="#E6C3A5" stroke="#18181B" stroke-width="4"/>
        <rect x="210" y="120" width="220" height="130" rx="16" fill="#FFFFFF" stroke="#18181B" stroke-width="4"/>
        <rect x="228" y="138" width="184" height="94" rx="8" fill="#FAF9F6" stroke="#18181B" stroke-width="2.5"/>
        <circle cx="320" cy="185" r="26" fill="#FFF0EC" stroke="#FF6B4A" stroke-width="3"/>
        <circle cx="311" cy="182" r="3" fill="#18181B"/>
        <circle cx="329" cy="182" r="3" fill="#18181B"/>
        <path d="M314 191Q320 196 326 191" fill="none" stroke="#18181B" stroke-width="2.5" stroke-linecap="round"/>
        <rect x="148" y="200" width="44" height="50" rx="10" fill="#FF6B4A" stroke="#18181B" stroke-width="3.5"/>
        <path d="M192 214C204 214 204 236 192 236" fill="none" stroke="#18181B" stroke-width="3.5"/>
        <ellipse cx="470" cy="234" rx="22" ry="16" fill="#34D399" stroke="#18181B" stroke-width="3.5"/>
      </svg>`),
    figma: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">
        <rect width="640" height="400" fill="#FFF0EC"/>
        <rect x="96" y="64" width="448" height="272" rx="22" fill="#FFFFFF" stroke="#18181B" stroke-width="4"/>
        <circle cx="132" cy="96" r="7" fill="#FF6B4A"/>
        <circle cx="156" cy="96" r="7" fill="#FBBF24"/>
        <circle cx="180" cy="96" r="7" fill="#34D399"/>
        <rect x="132" y="132" width="168" height="168" rx="16" fill="#FAF9F6" stroke="#E8E5DD" stroke-width="3"/>
        <ellipse cx="216" cy="218" rx="48" ry="42" fill="#FFFDF9" stroke="#18181B" stroke-width="3.5"/>
        <circle cx="200" cy="212" r="4.5" fill="#18181B"/>
        <circle cx="232" cy="212" r="4.5" fill="#18181B"/>
        <ellipse cx="190" cy="222" rx="6" ry="3.5" fill="#FFB4A2"/>
        <ellipse cx="242" cy="222" rx="6" ry="3.5" fill="#FFB4A2"/>
        <rect x="328" y="138" width="176" height="28" rx="8" fill="#18181B"/>
        <rect x="328" y="182" width="144" height="16" rx="8" fill="#E8E5DD"/>
        <rect x="328" y="210" width="164" height="16" rx="8" fill="#E8E5DD"/>
        <rect x="328" y="252" width="108" height="36" rx="10" fill="#FF6B4A"/>
      </svg>`),
    picnic: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">
        <rect width="640" height="400" fill="#ECFDF5"/>
        <circle cx="130" cy="94" r="38" fill="#FEF08A" stroke="#18181B" stroke-width="3.5"/>
        <path d="M0 280 Q160 230 320 270 T640 260 L640 400 L0 400 Z" fill="#A7F3D0"/>
        <ellipse cx="320" cy="285" rx="110" ry="26" fill="#FFFFFF" stroke="#18181B" stroke-width="3.5"/>
        <path d="M260 250 C260 205 288 182 320 182 C352 182 380 205 380 250 C380 274 352 284 320 284 C288 284 260 274 260 250Z" fill="#FFFDF9" stroke="#18181B" stroke-width="3.5"/>
        <circle cx="302" cy="232" r="4.5" fill="#18181B"/>
        <circle cx="338" cy="232" r="4.5" fill="#18181B"/>
        <ellipse cx="290" cy="242" rx="6.5" ry="4" fill="#FFB4A2"/>
        <ellipse cx="350" cy="242" rx="6.5" ry="4" fill="#FFB4A2"/>
        <path d="M312 242 Q320 250 328 242" fill="none" stroke="#18181B" stroke-width="3" stroke-linecap="round"/>
      </svg>`)
  };

  const DEFAULT_SAMPLE_POSTS = [
    {
      id: 'sample-1',
      user_id: 'demo-user-1',
      author_email: 'hello@mochi.studio',
      author_name: '모찌작가',
      author_avatar: 'mochi',
      category: '작업노트',
      title: '피그마 감성으로 꾸민 새 개인 작업실 오픈!',
      content: '따뜻한 오프화이트 배경과 1px 헤어라인 보더, 그리고 귀여운 벡터 캐릭터 모찌를 넣어 개인 공간을 만들어봤어요. 아이디 저장 로그인도 지원합니다.',
      image_url: SAMPLE_IMAGES.figma,
      likes: 12,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
    },
    {
      id: 'sample-2',
      user_id: 'demo-user-1',
      author_email: 'hello@mochi.studio',
      author_name: '키키',
      author_avatar: 'kiki',
      category: '일상',
      title: '오늘의 책상 위 작은 풍경',
      content: '따뜻한 코랄색 머그컵에 커피를 내리고 새 프로젝트를 스케치하는 오후. 작은 캐릭터가 모니터에서 반겨주니 기분이 좋아지네요.',
      image_url: SAMPLE_IMAGES.desk,
      likes: 8,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString()
    },
    {
      id: 'sample-3',
      user_id: 'demo-user-2',
      author_email: 'dubu@mochi.studio',
      author_name: '두부',
      author_avatar: 'dubu',
      category: '사진첩',
      title: '주말 햇살 아래 피크닉 기록',
      content: '날씨가 너무 좋아서 공원에 다녀왔어요. 게시판에 이미지를 올리고 클릭하면 크게 확대해서 볼 수도 있습니다!',
      image_url: SAMPLE_IMAGES.picnic,
      likes: 15,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString()
    }
  ];

  const SQL_SCHEMA_TEXT = `-- Supabase SQL Editor에서 실행하세요
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  author_email text not null,
  author_name text not null,
  author_avatar text default 'mochi',
  category text default '일상',
  title text not null,
  content text not null,
  image_url text,
  likes integer default 0,
  created_at timestamptz default now() not null
);

alter table public.posts enable row level security;
create policy "Public read" on public.posts for select using (true);
create policy "Auth insert" on public.posts for insert with check (auth.uid() = user_id);
create policy "Auth update" on public.posts for update using (auth.uid() = user_id);
create policy "Auth delete" on public.posts for delete using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true) on conflict (id) do nothing;

create policy "Public read images" on storage.objects for select using (bucket_id = 'post-images');
create policy "Auth upload images" on storage.objects for insert with check (bucket_id = 'post-images' and auth.role() = 'authenticated');`;

  // Application State
  const state = {
    supabase: null,
    isLiveSupabase: false,
    user: null,
    posts: [],
    likedIds: new Set(JSON.parse(localStorage.getItem(STORAGE_KEYS.DEMO_LIKES) || '[]')),
    activeCategory: '전체',
    searchQuery: '',
    authMode: 'login',
    selectedAvatar: 'mochi',
    pendingImageFile: null,
    pendingImageDataUrl: null
  };

  // DOM References
  const el = {
    statusBtn: document.getElementById('supabase-status-btn'),
    statusText: document.getElementById('supabase-status-text'),
    navAuthArea: document.getElementById('nav-auth-area'),
    heroMascot: document.getElementById('hero-mascot'),
    mascotBubble: document.getElementById('mascot-bubble'),
    heroWriteCta: document.getElementById('hero-write-cta'),
    statPosts: document.getElementById('stat-posts'),
    statPhotos: document.getElementById('stat-photos'),
    statMode: document.getElementById('stat-mode'),
    postCountBadge: document.getElementById('post-count-badge'),
    postsGrid: document.getElementById('posts-grid'),
    searchInput: document.getElementById('search-input'),
    toggleComposerBtn: document.getElementById('toggle-composer-btn'),
    composerCard: document.getElementById('composer-card'),
    closeComposerBtn: document.getElementById('close-composer-btn'),
    cancelPostBtn: document.getElementById('cancel-post-btn'),
    postForm: document.getElementById('post-form'),
    postCategory: document.getElementById('post-category'),
    postTitle: document.getElementById('post-title'),
    postContent: document.getElementById('post-content'),
    imageDropzone: document.getElementById('image-dropzone'),
    postImageInput: document.getElementById('post-image-input'),
    imagePreviewWrap: document.getElementById('image-preview-wrap'),
    imagePreview: document.getElementById('image-preview'),
    removeImageBtn: document.getElementById('remove-image-btn'),
    submitPostBtn: document.getElementById('submit-post-btn'),

    // Auth Modal
    authModal: document.getElementById('auth-modal'),
    closeAuthModal: document.getElementById('close-auth-modal'),
    authForm: document.getElementById('auth-form'),
    authModalTitle: document.getElementById('auth-modal-title'),
    authModalSubtitle: document.getElementById('auth-modal-subtitle'),
    signupNameGroup: document.getElementById('signup-name-group'),
    signupAvatarGroup: document.getElementById('signup-avatar-group'),
    avatarPicker: document.getElementById('avatar-picker'),
    authName: document.getElementById('auth-name'),
    authEmail: document.getElementById('auth-email'),
    authPassword: document.getElementById('auth-password'),
    rememberIdRow: document.getElementById('remember-id-row'),
    rememberIdCheckbox: document.getElementById('remember-id-checkbox'),
    authSubmitBtn: document.getElementById('auth-submit-btn'),
    quickDemoBtn: document.getElementById('quick-demo-btn'),
    demoLoginBox: document.getElementById('demo-login-box'),

    // Settings Modal
    settingsModal: document.getElementById('settings-modal'),
    closeSettingsModal: document.getElementById('close-settings-modal'),
    sbConfigForm: document.getElementById('supabase-config-form'),
    sbUrlInput: document.getElementById('sb-url-input'),
    sbKeyInput: document.getElementById('sb-key-input'),
    resetDemoBtn: document.getElementById('reset-demo-btn'),
    sqlPreview: document.getElementById('sql-preview'),
    copySqlBtn: document.getElementById('copy-sql-btn'),

    // Lightbox & Toast
    lightboxModal: document.getElementById('lightbox-modal'),
    lightboxImg: document.getElementById('lightbox-img'),
    toastContainer: document.getElementById('toast-container')
  };

  // ========================================================================
  // Utilities
  // ========================================================================
  function showToast(message, type = 'default') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    el.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'all 0.2s ease';
      setTimeout(() => toast.remove(), 220);
    }, 2800);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatDate(iso) {
    const d = new Date(iso);
    const now = new Date();
    const diffMin = Math.floor((now - d) / 60000);
    if (diffMin < 1) return '방금 전';
    if (diffMin < 60) return `${diffMin}분 전`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}시간 전`;
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  }

  function compressImage(file, maxWidth = 1200, quality = 0.84) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, maxWidth / img.width);
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          canvas.toBlob((blob) => resolve({ dataUrl, blob }), 'image/jpeg', quality);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // ========================================================================
  // Supabase Initialization & Dual Mode
  // ========================================================================
  async function initBackend() {
    const savedConfig = JSON.parse(localStorage.getItem(STORAGE_KEYS.SB_CONFIG) || 'null');
    if (savedConfig && savedConfig.url && savedConfig.anonKey && window.supabase) {
      try {
        state.supabase = window.supabase.createClient(savedConfig.url, savedConfig.anonKey);
        state.isLiveSupabase = true;
        el.sbUrlInput.value = savedConfig.url;
        el.sbKeyInput.value = savedConfig.anonKey;

        const { data: { session } } = await state.supabase.auth.getSession();
        if (session?.user) {
          state.user = mapSupabaseUser(session.user);
        }

        state.supabase.auth.onAuthStateChange((_event, sessionObj) => {
          state.user = sessionObj?.user ? mapSupabaseUser(sessionObj.user) : null;
          renderNavAuth();
          renderPosts();
        });
      } catch (err) {
        console.error('Supabase init error:', err);
        state.isLiveSupabase = false;
        showToast('Supabase 초기화 실패 — 데모 모드로 전환합니다.', 'error');
      }
    } else {
      state.isLiveSupabase = false;
      const demoUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.DEMO_USER) || 'null');
      state.user = demoUser;
    }

    updateConnectionUI();
    await loadPosts();
    renderNavAuth();
  }

  function mapSupabaseUser(sbUser) {
    return {
      id: sbUser.id,
      email: sbUser.email,
      name: sbUser.user_metadata?.name || sbUser.email.split('@')[0],
      avatar: sbUser.user_metadata?.avatar || 'mochi'
    };
  }

  function updateConnectionUI() {
    if (state.isLiveSupabase) {
      el.statusBtn.classList.add('is-live');
      el.statusText.textContent = 'Supabase 연결됨';
      el.statMode.textContent = 'Supabase Live';
      el.demoLoginBox.style.display = 'none';
    } else {
      el.statusBtn.classList.remove('is-live');
      el.statusText.textContent = '데모 모드';
      el.statMode.textContent = 'Local Demo';
      el.demoLoginBox.style.display = 'flex';
    }
  }

  // ========================================================================
  // Auth & Remember ID (아이디 저장)
  // ========================================================================
  function loadRememberedId() {
    const savedId = localStorage.getItem(STORAGE_KEYS.REMEMBER_ID);
    if (savedId) {
      el.authEmail.value = savedId;
      el.rememberIdCheckbox.checked = true;
    } else {
      el.authEmail.value = '';
      el.rememberIdCheckbox.checked = false;
    }
  }

  function persistRememberedId(email) {
    if (el.rememberIdCheckbox.checked && email) {
      localStorage.setItem(STORAGE_KEYS.REMEMBER_ID, email);
    } else {
      localStorage.removeItem(STORAGE_KEYS.REMEMBER_ID);
    }
  }

  function openAuthModal(mode = 'login') {
    setAuthMode(mode);
    loadRememberedId();
    el.authPassword.value = '';
    el.authModal.classList.add('open');
  }

  function closeAuthModal() {
    el.authModal.classList.remove('open');
  }

  function setAuthMode(mode) {
    state.authMode = mode;
    document.querySelectorAll('.auth-tab').forEach((tab) => {
      tab.classList.toggle('active', tab.dataset.authMode === mode);
    });

    const isSignup = mode === 'signup';
    el.signupNameGroup.style.display = isSignup ? 'block' : 'none';
    el.signupAvatarGroup.style.display = isSignup ? 'block' : 'none';
    el.rememberIdRow.style.display = isSignup ? 'none' : 'flex';
    el.authModalTitle.textContent = isSignup ? '새 계정 만들기' : 'Mochi Studio 로그인';
    el.authModalSubtitle.textContent = isSignup
      ? '귀여운 캐릭터 아바타를 골라 시작해보세요'
      : '로그인하고 나만의 사진과 글을 기록하세요';
    el.authSubmitBtn.textContent = isSignup ? '회원가입 완료' : '로그인하기';
  }

  function renderAvatarPicker() {
    el.avatarPicker.innerHTML = Object.entries(AVATAR_SVGS)
      .map(([key, svg]) => `
        <button type="button" class="avatar-option ${state.selectedAvatar === key ? 'selected' : ''}" data-avatar="${key}" title="${key}">
          ${svg}
        </button>
      `).join('');

    el.avatarPicker.querySelectorAll('.avatar-option').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.selectedAvatar = btn.dataset.avatar;
        renderAvatarPicker();
      });
    });
  }

  async function handleAuthSubmit(e) {
    e.preventDefault();
    const email = el.authEmail.value.trim();
    const password = el.authPassword.value;
    const name = el.authName.value.trim() || email.split('@')[0];

    if (!email || !password) return;

    el.authSubmitBtn.disabled = true;

    try {
      if (state.isLiveSupabase) {
        if (state.authMode === 'signup') {
          const { data, error } = await state.supabase.auth.signUp({
            email,
            password,
            options: { data: { name, avatar: state.selectedAvatar } }
          });
          if (error) throw error;
          if (data.user && !data.session) {
            showToast('인증 메일을 발송했습니다! 이메일을 확인해주세요.', 'success');
          } else {
            showToast(`환영합니다, ${name}님!`, 'success');
          }
          closeAuthModal();
        } else {
          const { data, error } = await state.supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          persistRememberedId(email);
          state.user = mapSupabaseUser(data.user);
          showToast(`${state.user.name}님, 반가워요!`, 'success');
          closeAuthModal();
          renderNavAuth();
          renderPosts();
        }
      } else {
        // Local Demo Mode
        if (state.authMode === 'login') {
          persistRememberedId(email);
        }
        const demoUser = {
          id: 'demo-user-1',
          email,
          name: state.authMode === 'signup' ? name : (email === 'hello@mochi.studio' ? '모찌작가' : email.split('@')[0]),
          avatar: state.selectedAvatar
        };
        state.user = demoUser;
        localStorage.setItem(STORAGE_KEYS.DEMO_USER, JSON.stringify(demoUser));
        showToast(`${demoUser.name}님으로 로그인되었습니다!`, 'success');
        closeAuthModal();
        renderNavAuth();
        renderPosts();
      }
    } catch (err) {
      showToast(err.message || '로그인 처리 중 오류가 발생했습니다.', 'error');
    } finally {
      el.authSubmitBtn.disabled = false;
    }
  }

  async function handleLogout() {
    if (state.isLiveSupabase) {
      await state.supabase.auth.signOut();
    } else {
      localStorage.removeItem(STORAGE_KEYS.DEMO_USER);
    }
    state.user = null;
    el.composerCard.classList.remove('open');
    renderNavAuth();
    renderPosts();
    showToast('로그아웃되었습니다.');
  }

  function renderNavAuth() {
    if (state.user) {
      const avatarSvg = AVATAR_SVGS[state.user.avatar] || AVATAR_SVGS.mochi;
      el.navAuthArea.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
          <div class="user-pill">
            <span class="user-avatar-sm">${avatarSvg}</span>
            <span>${escapeHtml(state.user.name)}</span>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" id="logout-btn">로그아웃</button>
        </div>
      `;
      document.getElementById('logout-btn').addEventListener('click', handleLogout);
    } else {
      el.navAuthArea.innerHTML = `
        <button type="button" class="btn btn-primary btn-sm" id="open-login-btn">로그인</button>
      `;
      document.getElementById('open-login-btn').addEventListener('click', () => openAuthModal('login'));
    }
  }

  // ========================================================================
  // Posts CRUD & Image Upload
  // ========================================================================
  async function loadPosts() {
    if (state.isLiveSupabase) {
      const { data, error } = await state.supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
        showToast('게시글을 불러오지 못했습니다. SQL 스키마를 확인하세요.', 'error');
        state.posts = [];
      } else {
        state.posts = data || [];
      }
    } else {
      const stored = localStorage.getItem(STORAGE_KEYS.DEMO_POSTS);
      if (stored) {
        state.posts = JSON.parse(stored);
      } else {
        state.posts = [...DEFAULT_SAMPLE_POSTS];
        localStorage.setItem(STORAGE_KEYS.DEMO_POSTS, JSON.stringify(state.posts));
      }
    }
    renderPosts();
  }

  function openComposer() {
    if (!state.user) {
      showToast('글을 작성하려면 먼저 로그인해주세요!');
      openAuthModal('login');
      return;
    }
    el.composerCard.classList.add('open');
    el.postTitle.focus();
  }

  function closeComposer() {
    el.composerCard.classList.remove('open');
    el.postForm.reset();
    clearPendingImage();
  }

  function clearPendingImage() {
    state.pendingImageFile = null;
    state.pendingImageDataUrl = null;
    el.postImageInput.value = '';
    el.imagePreviewWrap.style.display = 'none';
    el.imagePreview.src = '';
  }

  async function handleImageSelected(file) {
    if (!file || !file.type.startsWith('image/')) {
      showToast('이미지 파일만 업로드할 수 있습니다.', 'error');
      return;
    }
    try {
      const { dataUrl, blob } = await compressImage(file);
      state.pendingImageDataUrl = dataUrl;
      state.pendingImageFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' });
      el.imagePreview.src = dataUrl;
      el.imagePreviewWrap.style.display = 'inline-block';
    } catch {
      showToast('이미지를 처리하는 중 오류가 발생했습니다.', 'error');
    }
  }

  async function handlePostSubmit(e) {
    e.preventDefault();
    if (!state.user) {
      openAuthModal('login');
      return;
    }

    const title = el.postTitle.value.trim();
    const content = el.postContent.value.trim();
    const category = el.postCategory.value;
    if (!title || !content) return;

    el.submitPostBtn.disabled = true;
    el.submitPostBtn.textContent = '저장 중...';

    try {
      let imageUrl = null;

      if (state.isLiveSupabase) {
        if (state.pendingImageFile) {
          const filePath = `${state.user.id}/${Date.now()}.jpg`;
          const { error: uploadErr } = await state.supabase.storage
            .from('post-images')
            .upload(filePath, state.pendingImageFile, { contentType: 'image/jpeg' });
          if (uploadErr) throw uploadErr;

          const { data: urlData } = state.supabase.storage
            .from('post-images')
            .getPublicUrl(filePath);
          imageUrl = urlData.publicUrl;
        }

        const { data, error } = await state.supabase
          .from('posts')
          .insert([{
            user_id: state.user.id,
            author_email: state.user.email,
            author_name: state.user.name,
            author_avatar: state.user.avatar,
            category,
            title,
            content,
            image_url: imageUrl,
            likes: 0
          }])
          .select()
          .single();

        if (error) throw error;
        state.posts.unshift(data);
      } else {
        // Demo Mode
        const newPost = {
          id: 'post-' + Date.now(),
          user_id: state.user.id,
          author_email: state.user.email,
          author_name: state.user.name,
          author_avatar: state.user.avatar,
          category,
          title,
          content,
          image_url: state.pendingImageDataUrl,
          likes: 0,
          created_at: new Date().toISOString()
        };
        state.posts.unshift(newPost);
        localStorage.setItem(STORAGE_KEYS.DEMO_POSTS, JSON.stringify(state.posts));
      }

      closeComposer();
      renderPosts();
      showToast('새 이야기가 등록되었습니다! ✨', 'success');
    } catch (err) {
      showToast(err.message || '게시글 저장에 실패했습니다.', 'error');
    } finally {
      el.submitPostBtn.disabled = false;
      el.submitPostBtn.textContent = '게시하기';
    }
  }

  async function toggleLike(postId) {
    const post = state.posts.find((p) => p.id === postId);
    if (!post) return;

    const alreadyLiked = state.likedIds.has(postId);
    const delta = alreadyLiked ? -1 : 1;
    post.likes = Math.max(0, (post.likes || 0) + delta);

    if (alreadyLiked) {
      state.likedIds.delete(postId);
    } else {
      state.likedIds.add(postId);
    }
    localStorage.setItem(STORAGE_KEYS.DEMO_LIKES, JSON.stringify([...state.likedIds]));

    if (state.isLiveSupabase) {
      await state.supabase.from('posts').update({ likes: post.likes }).eq('id', postId);
    } else {
      localStorage.setItem(STORAGE_KEYS.DEMO_POSTS, JSON.stringify(state.posts));
    }
    renderPosts();
  }

  async function deletePost(postId) {
    if (!confirm('이 게시글을 삭제할까요?')) return;

    if (state.isLiveSupabase) {
      const { error } = await state.supabase.from('posts').delete().eq('id', postId);
      if (error) {
        showToast('삭제 권한이 없거나 오류가 발생했습니다.', 'error');
        return;
      }
    }

    state.posts = state.posts.filter((p) => p.id !== postId);
    if (!state.isLiveSupabase) {
      localStorage.setItem(STORAGE_KEYS.DEMO_POSTS, JSON.stringify(state.posts));
    }
    renderPosts();
    showToast('게시글이 삭제되었습니다.');
  }

  function renderPosts() {
    const query = state.searchQuery.trim().toLowerCase();
    const filtered = state.posts.filter((post) => {
      const catMatch = state.activeCategory === '전체' || post.category === state.activeCategory;
      const textMatch = !query ||
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.author_name.toLowerCase().includes(query);
      return catMatch && textMatch;
    });

    // Update Stats
    const photoCount = state.posts.filter((p) => Boolean(p.image_url)).length;
    el.statPosts.textContent = state.posts.length;
    el.statPhotos.textContent = photoCount;
    el.postCountBadge.textContent = `${filtered.length}개`;

    if (filtered.length === 0) {
      el.postsGrid.innerHTML = `
        <div class="empty-state">
          ${AVATAR_SVGS.dubu}
          <h4>아직 등록된 이야기가 없어요</h4>
          <p>첫 번째 사진과 이야기를 남겨보세요!</p>
        </div>
      `;
      return;
    }

    el.postsGrid.innerHTML = filtered.map((post) => {
      const isAuthor = state.user && state.user.id === post.user_id;
      const isLiked = state.likedIds.has(post.id);
      const avatarSvg = AVATAR_SVGS[post.author_avatar] || AVATAR_SVGS.mochi;

      return `
        <article class="post-card">
          ${post.image_url ? `
            <div class="post-media" data-zoom-src="${escapeHtml(post.image_url)}">
              <img src="${escapeHtml(post.image_url)}" alt="${escapeHtml(post.title)}" loading="lazy" />
              <span class="post-category-badge">${escapeHtml(post.category || '일상')}</span>
            </div>
          ` : ''}
          <div class="post-body">
            ${!post.image_url ? `<div style="margin-bottom:8px;"><span class="post-count-badge">${escapeHtml(post.category || '일상')}</span></div>` : ''}
            <h3 class="post-title">${escapeHtml(post.title)}</h3>
            <p class="post-excerpt">${escapeHtml(post.content)}</p>

            <div class="post-footer">
              <div class="post-author">
                <span class="user-avatar-sm">${avatarSvg}</span>
                <div class="post-author-info">
                  <span class="post-author-name">${escapeHtml(post.author_name)}</span>
                  <span class="post-date">${formatDate(post.created_at)}</span>
                </div>
              </div>

              <div class="post-actions">
                <button type="button" class="icon-btn ${isLiked ? 'liked' : ''}" data-like-id="${escapeHtml(post.id)}" aria-label="좋아요">
                  ♥ ${post.likes || 0}
                </button>
                ${isAuthor ? `
                  <button type="button" class="icon-btn delete" data-delete-id="${escapeHtml(post.id)}" aria-label="삭제">
                    삭제
                  </button>
                ` : ''}
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Bind card interactions
    el.postsGrid.querySelectorAll('[data-zoom-src]').forEach((media) => {
      media.addEventListener('click', () => {
        el.lightboxImg.src = media.dataset.zoomSrc;
        el.lightboxModal.classList.add('open');
      });
    });

    el.postsGrid.querySelectorAll('[data-like-id]').forEach((btn) => {
      btn.addEventListener('click', () => toggleLike(btn.dataset.likeId));
    });

    el.postsGrid.querySelectorAll('[data-delete-id]').forEach((btn) => {
      btn.addEventListener('click', () => deletePost(btn.dataset.deleteId));
    });
  }

  // ========================================================================
  // Event Listeners & Mascot Fun
  // ========================================================================
  function bindEvents() {
    // Hero Mascot Interaction
    const greetings = [
      '안녕! 나 모찌야, 클릭해볼래? ✨',
      '오늘도 멋진 하루 보내고 있어? ☁️',
      '로그인할 때 "아이디 저장" 꼭 챙겨! 🔑',
      '예쁜 사진도 게시판에 올려보자! 📸',
      '피그마 감성 어때? 깔끔하지! 🎨'
    ];
    let greetIdx = 0;
    const cycleGreeting = () => {
      greetIdx = (greetIdx + 1) % greetings.length;
      el.mascotBubble.textContent = greetings[greetIdx];
      el.mascotBubble.style.transform = 'scale(1.06)';
      setTimeout(() => { el.mascotBubble.style.transform = 'scale(1)'; }, 180);
    };
    el.heroMascot.addEventListener('click', cycleGreeting);
    el.heroMascot.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        cycleGreeting();
      }
    });

    // Category Tabs & Search
    document.querySelectorAll('.cat-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.cat-tab').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        state.activeCategory = tab.dataset.category;
        renderPosts();
      });
    });

    el.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderPosts();
    });

    // Composer Controls
    el.toggleComposerBtn.addEventListener('click', openComposer);
    el.heroWriteCta.addEventListener('click', () => {
      document.getElementById('board').scrollIntoView({ behavior: 'smooth' });
      openComposer();
    });
    el.closeComposerBtn.addEventListener('click', closeComposer);
    el.cancelPostBtn.addEventListener('click', closeComposer);
    el.postForm.addEventListener('submit', handlePostSubmit);

    // Image Dropzone
    el.imageDropzone.addEventListener('click', () => el.postImageInput.click());
    el.postImageInput.addEventListener('change', (e) => {
      if (e.target.files?.[0]) handleImageSelected(e.target.files[0]);
    });
    el.imageDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      el.imageDropzone.classList.add('dragover');
    });
    el.imageDropzone.addEventListener('dragleave', () => {
      el.imageDropzone.classList.remove('dragover');
    });
    el.imageDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      el.imageDropzone.classList.remove('dragover');
      if (e.dataTransfer.files?.[0]) handleImageSelected(e.dataTransfer.files[0]);
    });
    el.removeImageBtn.addEventListener('click', clearPendingImage);

    // Auth Modal
    el.closeAuthModal.addEventListener('click', closeAuthModal);
    el.authModal.addEventListener('click', (e) => {
      if (e.target === el.authModal) closeAuthModal();
    });
    document.querySelectorAll('.auth-tab').forEach((tab) => {
      tab.addEventListener('click', () => setAuthMode(tab.dataset.authMode));
    });
    el.authForm.addEventListener('submit', handleAuthSubmit);

    el.quickDemoBtn.addEventListener('click', () => {
      el.authEmail.value = 'hello@mochi.studio';
      el.authPassword.value = '123456';
      el.rememberIdCheckbox.checked = true;
      setAuthMode('login');
      el.authForm.requestSubmit();
    });

    // Supabase Settings Modal
    el.sqlPreview.textContent = SQL_SCHEMA_TEXT;
    el.statusBtn.addEventListener('click', () => el.settingsModal.classList.add('open'));
    el.closeSettingsModal.addEventListener('click', () => el.settingsModal.classList.remove('open'));
    el.settingsModal.addEventListener('click', (e) => {
      if (e.target === el.settingsModal) el.settingsModal.classList.remove('open');
    });

    el.sbConfigForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const url = el.sbUrlInput.value.trim();
      const anonKey = el.sbKeyInput.value.trim();
      if (!url || !anonKey) {
        showToast('URL과 Anon Key를 모두 입력해주세요.', 'error');
        return;
      }
      localStorage.setItem(STORAGE_KEYS.SB_CONFIG, JSON.stringify({ url, anonKey }));
      el.settingsModal.classList.remove('open');
      showToast('Supabase 설정을 적용합니다...', 'success');
      await initBackend();
    });

    el.resetDemoBtn.addEventListener('click', async () => {
      localStorage.removeItem(STORAGE_KEYS.SB_CONFIG);
      el.sbUrlInput.value = '';
      el.sbKeyInput.value = '';
      el.settingsModal.classList.remove('open');
      showToast('로컬 데모 모드로 전환되었습니다.');
      await initBackend();
    });

    el.copySqlBtn.addEventListener('click', async () => {
      await navigator.clipboard.writeText(SQL_SCHEMA_TEXT);
      showToast('SQL 스키마가 클립보드에 복사되었습니다!', 'success');
    });

    // Lightbox
    el.lightboxModal.addEventListener('click', () => {
      el.lightboxModal.classList.remove('open');
    });
  }

  // Bootstrap
  renderAvatarPicker();
  bindEvents();
  initBackend();
})();
