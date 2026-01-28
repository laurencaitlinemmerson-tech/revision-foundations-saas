<!doctype html>
<html lang="en" class="h-full">
 <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Revision Foundations</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="/_sdk/element_sdk.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&amp;family=Plus+Jakarta+Sans:wght@400;500;600&amp;display=swap" rel="stylesheet">
  <style>
        body {
            box-sizing: border-box;
        }
        
        :root {
            --lavender: #E8E0F0;
            --pink: #F5E6EA;
            --purple-accent: #9B7BB8;
            --text-dark: #4A3F55;
            --text-light: #7D6B8A;
        }
        
        .font-heading {
            font-family: 'Fraunces', serif;
        }
        
        .font-body {
            font-family: 'Plus Jakarta Sans', sans-serif;
        }
        
        .gradient-bg {
            background: linear-gradient(135deg, #F5E6EA 0%, #E8E0F0 50%, #E0E8F5 100%);
        }
        
        .blob {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            animation: blob-morph 8s ease-in-out infinite;
        }
        
        .blob-2 {
            border-radius: 40% 60% 70% 30% / 40% 70% 30% 60%;
            animation: blob-morph-2 10s ease-in-out infinite;
        }
        
        @keyframes blob-morph {
            0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
            50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }
        
        @keyframes blob-morph-2 {
            0%, 100% { border-radius: 40% 60% 70% 30% / 40% 70% 30% 60%; }
            50% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
        }
        
        .float-1 {
            animation: float-1 6s ease-in-out infinite;
        }
        
        .float-2 {
            animation: float-2 7s ease-in-out infinite;
        }
        
        .float-3 {
            animation: float-3 8s ease-in-out infinite;
        }
        
        @keyframes float-1 {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-2 {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(-5deg); }
        }
        
        @keyframes float-3 {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-25px) rotate(3deg); }
        }
        
        .soft-shadow {
            box-shadow: 0 8px 32px rgba(155, 123, 184, 0.15), 
                        0 4px 16px rgba(155, 123, 184, 0.1);
        }
        
        .icon-shadow {
            box-shadow: 0 12px 40px rgba(155, 123, 184, 0.25),
                        0 4px 12px rgba(155, 123, 184, 0.15),
                        inset 0 -4px 8px rgba(0, 0, 0, 0.05),
                        inset 0 4px 8px rgba(255, 255, 255, 0.8);
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #B794D4 0%, #9B7BB8 100%);
            box-shadow: 0 4px 16px rgba(155, 123, 184, 0.4),
                        0 2px 8px rgba(155, 123, 184, 0.2);
            transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 24px rgba(155, 123, 184, 0.5),
                        0 4px 12px rgba(155, 123, 184, 0.3);
        }
        
        .btn-secondary {
            border: 2px solid #B794D4;
            transition: all 0.3s ease;
        }
        
        .btn-secondary:hover {
            background: rgba(183, 148, 212, 0.1);
            transform: translateY(-2px);
        }
        
        .nav-link {
            position: relative;
            transition: color 0.3s ease;
        }
        
        .nav-link::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 50%;
            width: 0;
            height: 2px;
            background: linear-gradient(90deg, #B794D4, #D4A5B9);
            transition: all 0.3s ease;
            transform: translateX(-50%);
            border-radius: 2px;
        }
        
        .nav-link:hover::after {
            width: 100%;
        }
        
        .texture-overlay {
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
            opacity: 0.03;
        }
        
        .sparkle {
            animation: sparkle 2s ease-in-out infinite;
        }
        
        @keyframes sparkle {
            0%, 100% { opacity: 0.3; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1); }
        }
    </style>
  <style>@view-transition { navigation: auto; }</style>
  <script src="/_sdk/data_sdk.js" type="text/javascript"></script>
 </head>
 <body class="h-full font-body gradient-bg overflow-auto">
  <div class="relative min-h-full w-full"><!-- Texture Overlay -->
   <div class="absolute inset-0 texture-overlay pointer-events-none"></div><!-- Decorative Blobs -->
   <div class="absolute top-0 -left-20 w-96 h-96 blob opacity-60" style="background: linear-gradient(135deg, rgba(212, 165, 185, 0.4) 0%, rgba(183, 148, 212, 0.3) 100%);"></div>
   <div class="absolute bottom-0 -right-20 w-80 h-80 blob-2 opacity-50" style="background: linear-gradient(135deg, rgba(183, 148, 212, 0.3) 0%, rgba(180, 200, 230, 0.4) 100%);"></div>
   <div class="absolute top-1/3 right-1/4 w-64 h-64 blob opacity-30" style="background: linear-gradient(135deg, rgba(245, 230, 234, 0.6) 0%, rgba(232, 224, 240, 0.5) 100%);"></div><!-- Navigation -->
   <nav class="relative z-10 px-6 py-5 md:px-12 lg:px-20">
    <div class="max-w-7xl mx-auto flex items-center justify-between"><!-- Logo -->
     <div class="flex items-center gap-2">
      <div class="w-10 h-10 rounded-2xl bg-white icon-shadow flex items-center justify-center">
       <svg width="24" height="24" viewbox="0 0 24 24" fill="none"><path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#B794D4" /> <path d="M2 17L12 22L22 17" stroke="#D4A5B9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /> <path d="M2 12L12 17L22 12" stroke="#9B7BB8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
       </svg>
      </div><span class="font-heading font-semibold text-lg" style="color: #4A3F55;">Revision Foundations</span>
     </div><!-- Nav Links - Hidden on mobile -->
     <div class="hidden md:flex items-center gap-8"><a href="#" class="nav-link text-sm font-medium" style="color: #4A3F55;">Home</a> <a href="#" class="nav-link text-sm font-medium" style="color: #7D6B8A;">Pricing</a> <a href="#" class="nav-link text-sm font-medium" style="color: #7D6B8A;">About</a> <a href="#" class="nav-link text-sm font-medium" style="color: #7D6B8A;">Contact</a>
     </div><!-- Auth Buttons -->
     <div class="flex items-center gap-3"><a href="#" class="hidden sm:block text-sm font-medium transition-colors hover:opacity-70" style="color: #7D6B8A;">Sign In</a> <button class="btn-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full"> Get Started </button>
     </div>
    </div>
   </nav><!-- Hero Section -->
   <main class="relative z-10 px-6 md:px-12 lg:px-20 pt-12 md:pt-20 pb-20">
    <div class="max-w-7xl mx-auto">
     <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20"><!-- Text Content -->
      <div class="flex-1 text-center lg:text-left"><!-- Badge -->
       <div class="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 mb-6 soft-shadow"><span class="text-lg">✨</span> <span class="text-sm font-medium" style="color: #9B7BB8;">Made for Children's Nursing Students</span>
       </div><!-- Headline -->
       <h1 id="headline" class="font-heading font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6" style="color: #4A3F55;">Revision Foundations</h1><!-- Subheadline -->
       <p id="subheadline" class="text-lg md:text-xl leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0" style="color: #7D6B8A;">Cute, simple revision tools to help you ace your nursing exams. Made by a student who's been there!</p><!-- CTA Buttons -->
       <div class="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"><button id="primary-btn" class="btn-primary text-white font-semibold px-8 py-4 rounded-full text-lg w-full sm:w-auto"> Get Started </button> <button id="secondary-btn" class="btn-secondary font-semibold px-8 py-4 rounded-full text-lg w-full sm:w-auto" style="color: #9B7BB8;"> Try Free Preview </button>
       </div><!-- Social Proof -->
       <div class="mt-10 flex items-center gap-4 justify-center lg:justify-start">
        <div class="flex -space-x-3">
         <div class="w-10 h-10 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 border-2 border-white flex items-center justify-center text-sm">
          👩‍⚕️
         </div>
         <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-200 to-blue-200 border-2 border-white flex items-center justify-center text-sm">
          👨‍⚕️
         </div>
         <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-200 to-pink-200 border-2 border-white flex items-center justify-center text-sm">
          👩‍⚕️
         </div>
        </div>
        <div class="text-sm" style="color: #7D6B8A;"><span class="font-semibold" style="color: #4A3F55;">500+</span> students already revising
        </div>
       </div>
      </div><!-- 3D Icons Section -->
      <div class="flex-1 relative w-full max-w-md lg:max-w-lg"><!-- Central Card -->
       <div class="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 soft-shadow"><!-- Decorative sparkles -->
        <div class="absolute top-4 right-4 sparkle" style="animation-delay: 0s;">
         <svg width="16" height="16" viewbox="0 0 16 16" fill="#D4A5B9"><path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z" />
         </svg>
        </div>
        <div class="absolute bottom-6 left-6 sparkle" style="animation-delay: 0.5s;">
         <svg width="12" height="12" viewbox="0 0 16 16" fill="#B794D4"><path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z" />
         </svg>
        </div><!-- Content Preview -->
        <div class="space-y-4">
         <div class="flex items-center gap-3">
          <div class="w-3 h-3 rounded-full" style="background: #D4A5B9;"></div>
          <div class="h-3 rounded-full flex-1" style="background: linear-gradient(90deg, #E8E0F0, #F5E6EA);"></div>
         </div>
         <div class="flex items-center gap-3">
          <div class="w-3 h-3 rounded-full" style="background: #B794D4;"></div>
          <div class="h-3 rounded-full w-3/4" style="background: linear-gradient(90deg, #F5E6EA, #E8E0F0);"></div>
         </div>
         <div class="flex items-center gap-3">
          <div class="w-3 h-3 rounded-full" style="background: #9B7BB8;"></div>
          <div class="h-3 rounded-full w-1/2" style="background: linear-gradient(90deg, #E8E0F0, #E0E8F5);"></div>
         </div>
        </div><!-- Progress Bar -->
        <div class="mt-6 bg-gray-100 rounded-full h-2 overflow-hidden">
         <div class="h-full rounded-full w-3/4" style="background: linear-gradient(90deg, #B794D4, #D4A5B9);"></div>
        </div>
        <p class="text-xs mt-2 text-center" style="color: #7D6B8A;">75% complete • Keep going! 💪</p>
       </div><!-- Floating Icons --> <!-- Book Icon -->
       <div class="absolute -top-6 -left-4 float-1">
        <div class="w-16 h-16 rounded-2xl bg-white icon-shadow flex items-center justify-center">
         <svg width="32" height="32" viewbox="0 0 32 32" fill="none"><rect x="4" y="4" width="24" height="24" rx="3" fill="#F5E6EA" /> <rect x="6" y="6" width="20" height="20" rx="2" fill="#E8E0F0" /> <path d="M16 10V22M16 10C16 10 14 8 10 8V20C14 20 16 22 16 22M16 10C16 10 18 8 22 8V20C18 20 16 22 16 22" stroke="#9B7BB8" stroke-width="2" stroke-linecap="round" />
         </svg>
        </div>
       </div><!-- Checklist Icon -->
       <div class="absolute -top-2 -right-4 float-2">
        <div class="w-14 h-14 rounded-xl bg-white icon-shadow flex items-center justify-center">
         <svg width="28" height="28" viewbox="0 0 28 28" fill="none"><rect x="4" y="4" width="20" height="20" rx="4" fill="#E8E0F0" /> <path d="M9 12L12 15L19 8" stroke="#B794D4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" /> <path d="M9 19H19" stroke="#D4A5B9" stroke-width="2" stroke-linecap="round" />
         </svg>
        </div>
       </div><!-- Stopwatch Icon -->
       <div class="absolute -bottom-4 -right-2 float-3">
        <div class="w-16 h-16 rounded-2xl bg-white icon-shadow flex items-center justify-center">
         <svg width="32" height="32" viewbox="0 0 32 32" fill="none"><circle cx="16" cy="18" r="10" fill="#F5E6EA" /> <circle cx="16" cy="18" r="8" fill="#E8E0F0" /> <circle cx="16" cy="18" r="6" stroke="#B794D4" stroke-width="2" /> <path d="M16 14V18L19 20" stroke="#9B7BB8" stroke-width="2" stroke-linecap="round" /> <rect x="14" y="4" width="4" height="4" rx="1" fill="#D4A5B9" />
         </svg>
        </div>
       </div><!-- Heart Icon -->
       <div class="absolute bottom-8 -left-6 float-2" style="animation-delay: -2s;">
        <div class="w-12 h-12 rounded-xl bg-white icon-shadow flex items-center justify-center">
         <svg width="24" height="24" viewbox="0 0 24 24" fill="none"><path d="M12 21C12 21 4 15 4 9.5C4 6.5 6.5 4 9.5 4C11 4 12 5 12 5C12 5 13 4 14.5 4C17.5 4 20 6.5 20 9.5C20 15 12 21 12 21Z" fill="#D4A5B9" stroke="#B794D4" stroke-width="1.5" />
         </svg>
        </div>
       </div>
      </div>
     </div>
    </div>
   </main><!-- Bottom Wave -->
   <div class="absolute bottom-0 left-0 right-0 pointer-events-none">
    <svg viewbox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveaspectratio="none" class="w-full h-16 md:h-24"><path d="M0 100V60C240 20 480 0 720 20C960 40 1200 80 1440 60V100H0Z" fill="white" fill-opacity="0.5" />
    </svg>
   </div>
  </div>
  <script>
        const defaultConfig = {
            headline: "Revision Foundations",
            subheadline: "Cute, simple revision tools to help you ace your nursing exams. Made by a student who's been there!",
            primary_btn: "Get Started",
            secondary_btn: "Try Free Preview",
            background_color: "#F5E6EA",
            surface_color: "#FFFFFF",
            text_color: "#4A3F55",
            primary_action: "#9B7BB8",
            secondary_action: "#7D6B8A"
        };

        async function onConfigChange(config) {
            document.getElementById('headline').textContent = config.headline || defaultConfig.headline;
            document.getElementById('subheadline').textContent = config.subheadline || defaultConfig.subheadline;
            document.getElementById('primary-btn').textContent = config.primary_btn || defaultConfig.primary_btn;
            document.getElementById('secondary-btn').textContent = config.secondary_btn || defaultConfig.secondary_btn;
            
            // Apply colors
            const bgColor = config.background_color || defaultConfig.background_color;
            const surfaceColor = config.surface_color || defaultConfig.surface_color;
            const textColor = config.text_color || defaultConfig.text_color;
            const primaryAction = config.primary_action || defaultConfig.primary_action;
            const secondaryAction = config.secondary_action || defaultConfig.secondary_action;
            
            document.body.style.background = `linear-gradient(135deg, ${bgColor} 0%, #E8E0F0 50%, #E0E8F5 100%)`;
            
            document.querySelectorAll('.bg-white, .bg-white\\/70, .bg-white\\/80').forEach(el => {
                el.style.backgroundColor = surfaceColor;
            });
            
            document.getElementById('headline').style.color = textColor;
            
            document.querySelectorAll('.btn-primary').forEach(btn => {
                btn.style.background = `linear-gradient(135deg, ${primaryAction}dd 0%, ${primaryAction} 100%)`;
            });
            
            document.querySelectorAll('.btn-secondary').forEach(btn => {
                btn.style.borderColor = primaryAction;
                btn.style.color = primaryAction;
            });
            
            document.querySelectorAll('.nav-link').forEach(link => {
                link.style.color = secondaryAction;
            });
        }

        function mapToCapabilities(config) {
            return {
                recolorables: [
                    {
                        get: () => config.background_color || defaultConfig.background_color,
                        set: (value) => { config.background_color = value; window.elementSdk.setConfig({ background_color: value }); }
                    },
                    {
                        get: () => config.surface_color || defaultConfig.surface_color,
                        set: (value) => { config.surface_color = value; window.elementSdk.setConfig({ surface_color: value }); }
                    },
                    {
                        get: () => config.text_color || defaultConfig.text_color,
                        set: (value) => { config.text_color = value; window.elementSdk.setConfig({ text_color: value }); }
                    },
                    {
                        get: () => config.primary_action || defaultConfig.primary_action,
                        set: (value) => { config.primary_action = value; window.elementSdk.setConfig({ primary_action: value }); }
                    },
                    {
                        get: () => config.secondary_action || defaultConfig.secondary_action,
                        set: (value) => { config.secondary_action = value; window.elementSdk.setConfig({ secondary_action: value }); }
                    }
                ],
                borderables: [],
                fontEditable: undefined,
                fontSizeable: undefined
            };
        }

        function mapToEditPanelValues(config) {
            return new Map([
                ["headline", config.headline || defaultConfig.headline],
                ["subheadline", config.subheadline || defaultConfig.subheadline],
                ["primary_btn", config.primary_btn || defaultConfig.primary_btn],
                ["secondary_btn", config.secondary_btn || defaultConfig.secondary_btn]
            ]);
        }

        if (window.elementSdk) {
            window.elementSdk.init({
                defaultConfig,
                onConfigChange,
                mapToCapabilities,
                mapToEditPanelValues
            });
        } else {
            onConfigChange(defaultConfig);
        }
    </script>
 <script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9c47f201267decea',t:'MTc2OTUxMzcxMy4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script></body>
</html>
