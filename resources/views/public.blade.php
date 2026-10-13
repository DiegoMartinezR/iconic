@php
$component = Route::currentRouteName();
$currentUrl = request()->url();
$isCheckout = ($page->correlative ?? '') === 'checkout' || 
              ($page->component ?? '') === 'checkout' || 
              (str_contains($currentUrl, '/checkout') && !str_contains($currentUrl, '/admin'));
@endphp

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="generator" content="Rhino Builder · Rhino Technology S.A.C. · RUC 20615611639 · rhino.pe">
    @viteReactRefresh
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    @php
    $isDetailPage = isset($data['using']['slug']) && is_array($data['using']['slug']) && isset($data['using']['slug']['model']);
    $modelName = $isDetailPage ? $data['using']['slug']['model'] : null;
    $item = null;
    if ($isDetailPage && isset($data[$modelName]) && $data[$modelName]) { $item = $data[$modelName]; }

    if ($item) {
        $pageTitle = $item->meta_title ?? $item->name;
        $rawDescription = $item->meta_description ?? strip_tags($item->summary ?? $item->description ?? '');
        if (empty($rawDescription)) { $rawDescription = $generals->where('correlative', 'site_description')->first()?->description ?? ''; }
        $pageDescription = \Illuminate\Support\Str::limit(trim(preg_replace('/\s+/', ' ', $rawDescription)), 160);
        $pageKeywords = $item->meta_keywords ?? '';
        $modelClass = get_class($item);
        $modelSimpleName = str_replace('App\\Models\\', '', $modelClass);
        $snake_case = Illuminate\Support\Str::snake($modelSimpleName);
        if ($snake_case === 'item_image') { $snake_case = 'item'; }
        $pageImageRaw = $item->image ? asset("storage/images/{$snake_case}/{$item->image}") : ($generals->where('correlative', 'og_image')->first()?->description ?? '');
        $pageImage = $pageImageRaw ? (filter_var($pageImageRaw, FILTER_VALIDATE_URL) ? $pageImageRaw : asset('assets/resources/' . $pageImageRaw)) : '';
        $pageUrl = $item->canonical_url ?? url()->current();
        $pageAuthor = (isset($item->author) && $item->author) ? $item->author : ($generals->where('correlative', 'meta_author')->first()?->description ?? 'Powered by Rhino Technology');

        $ogTitle = $pageTitle;
        $ogDescription = $pageDescription;
        $ogImage = $pageImage;
        $ogUrl = $pageUrl;
        $twitterTitle = $pageTitle;
        $twitterDescription = $pageDescription;
        $twitterImage = $pageImage;
        $twitterCard = 'summary_large_image';
        $canonicalUrl = $pageUrl;
        $siteTitle = $generals->where('correlative', 'site_title')->first()?->description ?? config('app.name', 'Rhino Technology');
    } else {
        $siteTitle = $generals->where('correlative', 'site_title')->first()?->description ?? config('app.name', 'Rhino Technology');
        $siteDescription = $generals->where('correlative', 'site_description')->first()?->description ?? '';
        $siteKeywords = $generals->where('correlative', 'site_keywords')->first()?->description ?? '';
        $pageTitle = $data['name'] ?? $siteTitle;
        $rawDescription = $data['description'] ?? $siteDescription;
        $pageDescription = \Illuminate\Support\Str::limit(trim(preg_replace('/\s+/', ' ', $rawDescription)), 160);
        $pageKeywords = isset($data['keywords']) ? implode(', ', $data['keywords']) : $siteKeywords;
        $pageAuthor = $generals->where('correlative', 'meta_author')->first()?->description ?? 'Powered by Rhino Technology';

        $ogTitle = $generals->where('correlative', 'og_title')->first()?->description ?? $pageTitle;
        $ogDescription = $generals->where('correlative', 'og_description')->first()?->description ?? $pageDescription;
        
        $ogImageRaw = $generals->where('correlative', 'og_image')->first()?->description;
        $ogImage = $ogImageRaw ? (filter_var($ogImageRaw, FILTER_VALIDATE_URL) ? $ogImageRaw : asset('assets/resources/' . $ogImageRaw)) : '';
        
        $ogUrl = $generals->where('correlative', 'og_url')->first()?->description ?? url()->current();

        $twitterTitle = $generals->where('correlative', 'twitter_title')->first()?->description ?? $ogTitle;
        $twitterDescription = $generals->where('correlative', 'twitter_description')->first()?->description ?? $ogDescription;
        
        $twitterImageRaw = $generals->where('correlative', 'twitter_image')->first()?->description;
        $twitterImage = $twitterImageRaw ? (filter_var($twitterImageRaw, FILTER_VALIDATE_URL) ? $twitterImageRaw : asset('assets/resources/' . $twitterImageRaw)) : $ogImage;
        
        $twitterCard = $generals->where('correlative', 'twitter_card')->first()?->description ?? 'summary_large_image';
        $canonicalUrl = url()->current();
    }
    $twitterSite = $generals->where('correlative', 'twitter_site')->first()?->description ?? '@rainstarstore';
    $twitterCreator = $generals->where('correlative', 'twitter_creator')->first()?->description ?? '@rainstarstore';

    // FAQs para schema FAQPage (global en todas las páginas)
    $globalFaqs = \Illuminate\Support\Facades\Cache::remember('global_faqs_blade', 3600, function () {
        return \App\Models\Faq::where('status', true)->get(['question', 'answer']);
    });
    @endphp

    @php
    $version = config('app.version', '1.0.1');
    $titleTag = (trim($pageTitle) === trim($siteTitle) || empty($pageTitle)) ? $siteTitle : "{$pageTitle} | {$siteTitle}";
    @endphp

    <title>{{ $titleTag }}</title>

    @php
    $siteName = $siteTitle;
    $logoUrl = asset('assets/resources/logo.png');

    // Fallbacks para páginas de detalle (donde no se define $siteDescription)
    $siteDescription = $siteDescription ?? $generals->where('correlative', 'site_description')->first()?->description ?? '';
    $siteKeywords = $siteKeywords ?? $generals->where('correlative', 'site_keywords')->first()?->description ?? '';

    // Schema Organization & WebSite
    $isEcommerce = trim($generals->where('correlative', 'is_ecommerce')->first()?->description ?? 'false') === 'true';
    $searchEnabled = (data_get($data, 'search_enabled') == true || data_get($data, 'search_enabled') == 'true');
    $searchPattern = data_get($data, 'search_pattern') ?? '/catalogo?q={search_term_string}';

    // Schema Organization
    $organizationSchema = [
        "@type" => "Organization",
        "name" => $siteName,
        "url" => url('/'),
        "logo" => [
            "@type" => "ImageObject",
            "url" => $logoUrl
        ],
        "description" => $siteDescription,
        "email" => $generals->where('correlative', 'email_contact')->first()?->description,
        "telephone" => $generals->where('correlative', 'phone_contact')->first()?->description,
        "contactPoint" => [
            "@type" => "ContactPoint",
            "telephone" => $generals->where('correlative', 'phone_contact')->first()?->description,
            "contactType" => "customer service",
            "areaServed" => "PE",
            "availableLanguage" => "Spanish"
        ],
        "sameAs" => array_values(array_filter([
            $generals->where('correlative', 'facebook')->first()?->description,
            $generals->where('correlative', 'instagram')->first()?->description,
            $generals->where('correlative', 'twitter')->first()?->description,
            $generals->where('correlative', 'linkedin')->first()?->description,
            $generals->where('correlative', 'youtube')->first()?->description,
            $generals->where('correlative', 'tiktok')->first()?->description,
        ]))
    ];

    // Schema WebSite with embedded publisher
    $websiteSchema = [
        "@type" => "WebSite",
        "name" => $siteName,
        "url" => url('/'),
        "publisher" => $organizationSchema
    ];

    // Graph Construction
    $graph = [
        $organizationSchema,
        $websiteSchema
    ];

    // Search Action (Only for Home and if enabled)
    if ($isEcommerce && $searchEnabled) {
        $searchUrl = rtrim(url('/'), '/') . (str_starts_with($searchPattern, '/') ? '' : '/') . $searchPattern;
        $graph[1]["potentialAction"] = [
            "@type" => "SearchAction",
            "target" => [
                "@type" => "EntryPoint",
                "urlTemplate" => $searchUrl
            ],
            "query-input" => "required name=search_term_string"
        ];
    }

    // Details/Article/Product
    if ($isDetailPage && isset($item)) {
        if ($modelName === 'Post') {
            $graph[] = [
                "@type" => "NewsArticle",
                "headline" => $pageTitle,
                "description" => $pageDescription,
                "image" => $pageImage,
                "datePublished" => $item->created_at ? $item->created_at->toIso8601String() : null,
                "dateModified" => $item->updated_at ? $item->updated_at->toIso8601String() : null,
                "author" => [
                    "@type" => "Organization",
                    "name" => $item->author ?? $siteName
                ],
                "publisher" => $organizationSchema,
                "mainEntityOfPage" => [
                    "@type" => "WebPage",
                    "url" => url()->current()
                ]
            ];
        } elseif ($modelName === 'Item') {
            $graph[] = [
                "@type" => "Product",
                "name" => $item->name,
                "url" => url()->current(),
                "image" => $pageImage,
                "description" => $pageDescription,
                "sku" => $item->sku ?? $item->id,
                "brand" => [
                    "@type" => "Brand",
                    "name" => $item->brand->name ?? $siteName
                ],
                "offers" => [
                    "@type" => "Offer",
                    "url" => url()->current(),
                    "priceCurrency" => "PEN",
                    "price" => $item->final_price ?? $item->price ?? 0,
                    "availability" => ($item->stock > 0 || !$item->sold_out) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
                ]
            ];
        } elseif ($modelName === 'Service') {
            $graph[] = [
                "@type" => "Service",
                "name" => $pageTitle,
                "description" => $pageDescription,
                "url" => url()->current(),
                "provider" => $organizationSchema,
                ...(($pageImage) ? ["image" => $pageImage] : []),
                ...(($item->category) ? ["category" => $item->category->name] : [])
            ];
        }
    }

    // Breadcrumbs
    $breadcrumbs = [
        [
            "@type" => "ListItem",
            "position" => 1,
            "name" => "Inicio",
            "item" => url('/')
        ]
    ];

    if ($isDetailPage && isset($item)) {
        if ($modelName === 'Post') {
            $breadcrumbs[] = [
                "@type" => "ListItem",
                "position" => 2,
                "name" => "Blogs",
                "item" => url('/blogs')
            ];
            $breadcrumbs[] = [
                "@type" => "ListItem",
                "position" => 3,
                "name" => $item->name,
                "item" => url()->current()
            ];
        } elseif ($modelName === 'Item') {
            $breadcrumbs[] = [
                "@type" => "ListItem",
                "position" => 2,
                "name" => "Catálogo",
                "item" => url('/catalogo')
            ];
            if (isset($item->category) && $item->category) {
                $breadcrumbs[] = [
                    "@type" => "ListItem",
                    "position" => 3,
                    "name" => $item->category->name,
                    "item" => url('/catalogo?category=' . $item->category->id)
                ];
                $breadcrumbs[] = [
                    "@type" => "ListItem",
                    "position" => 4,
                    "name" => $item->name,
                    "item" => url()->current()
                ];
            } else {
                $breadcrumbs[] = [
                    "@type" => "ListItem",
                    "position" => 3,
                    "name" => $item->name,
                    "item" => url()->current()
                ];
            }
        } elseif ($modelName === 'Service') {
            $breadcrumbs[] = [
                "@type" => "ListItem",
                "position" => 2,
                "name" => "Servicios",
                "item" => url('/servicios')
            ];
            if (isset($item->category) && $item->category) {
                $breadcrumbs[] = [
                    "@type" => "ListItem",
                    "position" => 3,
                    "name" => $item->category->name,
                    "item" => url('/servicios')
                ];
                $breadcrumbs[] = [
                    "@type" => "ListItem",
                    "position" => 4,
                    "name" => $item->name,
                    "item" => url()->current()
                ];
            } else {
                $breadcrumbs[] = [
                    "@type" => "ListItem",
                    "position" => 3,
                    "name" => $item->name,
                    "item" => url()->current()
                ];
            }
        }
    } elseif (isset($data['name']) && $data['name'] !== $siteTitle) {
         $breadcrumbs[] = [
            "@type" => "ListItem",
            "position" => 2,
            "name" => $data['name'],
            "item" => url()->current()
        ];
    }

    if (count($breadcrumbs) > 1) {
        $graph[] = [
            "@type" => "BreadcrumbList",
            "itemListElement" => $breadcrumbs
        ];
    }
    @endphp

    <script id="server-schema-graph" type="application/ld+json" data-service-slug="{{ $item->slug ?? '' }}">
    {
        "@context": "https://schema.org",
        "@graph": {!! json_encode($graph, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}
    }
    </script>

    @php
    // FAQs para schema: usar FAQs del producto en páginas de detalle si existen, sino globales
    $faqsToRender = collect([]);
    if ($isDetailPage && isset($item) && in_array($modelName, ['Item', 'Service'])) {
        $itemFaqs = $item->faqs ?? null;
        if (!empty($itemFaqs) && is_array($itemFaqs)) {
            $faqsToRender = collect($itemFaqs)->filter(fn($f) => !empty($f['question']) && !empty($f['answer']));
        }
    }
    // Fallback: FAQs globales si no hay específicos
    if ($faqsToRender->isEmpty()) {
        $faqsToRender = $globalFaqs->map(fn($f) => ['question' => $f->question, 'answer' => $f->answer]);
    }

    $faqEntities = $faqsToRender->map(function ($faq) {
        return [
            '@type' => 'Question',
            'name' => $faq['question'],
            'acceptedAnswer' => [
                '@type' => 'Answer',
                'text' => strip_tags($faq['answer'] ?? ''),
            ],
        ];
    })->values()->all();
    @endphp
    @if(!empty($faqEntities))
    <script id="server-schema-faq" type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": {!! json_encode($faqEntities, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}
    }
    </script>
    @endif
    <link rel="shortcut icon" href="/assets/resources/icon.png?v={{ $version }}" type="image/png">
    
    @if(isset($data['firstActiveSliderImage']) && $data['firstActiveSliderImage'])
    <link rel="preload" as="image" href="/storage/images/slider/{{ $data['firstActiveSliderImage'] }}" fetchpriority="high" media="(min-width: 768px)">
    @endif
    @if(isset($data['firstActiveSliderImageMobile']) && $data['firstActiveSliderImageMobile'])
    <link rel="preload" as="image" href="/storage/images/slider/{{ $data['firstActiveSliderImageMobile'] }}" fetchpriority="high" media="(max-width: 767px)">
    @endif

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <meta name="title" content="{{ $pageTitle }}">
    <meta name="description" content="{{ $pageDescription }}">
    @if($pageKeywords)
    <meta name="keywords" content="{{ $pageKeywords }}">
    @endif
    <meta name="author" content="{{ $pageAuthor }}">
    @php
    $isNoIndex = $isCheckout || str_contains($currentUrl, '/cart') || str_contains($currentUrl, '/carrito') || str_contains($currentUrl, '/account') || str_contains($currentUrl, '/customer') || str_contains($currentUrl, '/pago') || str_contains($currentUrl, '/confirmacion');
    $robotsContent = $isNoIndex ? 'noindex, nofollow' : 'index, follow';
    
    $ogType = 'website';
    if ($isDetailPage) {
        $ogType = match($modelName) {
            'Post' => 'article',
            'Item' => 'product',
            default => 'website'
        };
    }
    @endphp
    <link rel="canonical" href="{{ $canonicalUrl }}">
    <meta name="robots" content="{{ $robotsContent }}">

    @php
    $ogLocale = $generals->where('correlative', 'og_locale')->first()?->description;
    $ogLocale = !empty(trim($ogLocale ?? '')) ? trim($ogLocale) : 'es_PE';
    @endphp
    <meta property="og:locale" content="{{ $ogLocale }}">
    <meta property="og:type" content="{{ $ogType }}">
    <meta property="og:url" content="{{ $ogUrl }}">
    <meta property="og:title" content="{{ $ogTitle }}">
    <meta property="og:description" content="{{ $ogDescription }}">
    @if(!empty($ogImage))
    <meta property="og:image" content="{{ $ogImage }}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    @endif
    <meta property="og:site_name" content="{{ $siteTitle }}">

    @if($isDetailPage && isset($item))
    @if(!empty($item->created_at))
    <meta property="article:published_time" content="{{ is_object($item->created_at) ? $item->created_at->toIso8601String() : $item->created_at }}"> @endif
    @if(!empty($item->updated_at))
    <meta property="article:modified_time" content="{{ is_object($item->updated_at) ? $item->updated_at->toIso8601String() : $item->updated_at }}"> @endif
    @if(isset($item->category) && $item->category)
    <meta property="article:section" content="{{ $item->category->name }}"> @endif
    @if(isset($item->tags) && count($item->tags) > 0)
    @foreach($item->tags as $tag)
    <meta property="article:tag" content="{{ $tag->name }}"> @endforeach
    @endif
    @endif

    <meta name="twitter:card" content="{{ $twitterCard }}">
    <meta name="twitter:url" content="{{ $ogUrl }}">
    <meta name="twitter:title" content="{{ $twitterTitle }}">
    <meta name="twitter:description" content="{{ $twitterDescription }}">
    @if(!empty($twitterImage))
    <meta name="twitter:image" content="{{ $twitterImage }}"> @endif
    <meta name="twitter:site" content="{{ $twitterSite }}">
    <meta name="twitter:creator" content="{{ $twitterCreator }}">
    <meta name="twitter:domain" content="{{ request()->getHost() }}">

    @if($isCheckout)
    <link rel="preload" href="/lte/assets/libs/select2/css/select2.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript>
        <link rel="stylesheet" href="/lte/assets/libs/select2/css/select2.min.css" media="print" onload="this.media='all'">
    </noscript>
    @endif

    <!-- Font Awesome Cargado en Idle para cero bloqueo FCP/LCP -->
    <script>
        function loadFontAwesome() {
            if (window.__faLoaded) return;
            window.__faLoaded = true;
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            document.head.appendChild(link);
        }
        if ('requestIdleCallback' in window) {
            requestIdleCallback(loadFontAwesome, { timeout: 2000 });
        } else {
            setTimeout(loadFontAwesome, 1500);
        }
        ['touchstart', 'scroll', 'mousemove'].forEach(function(e) {
            window.addEventListener(e, loadFontAwesome, { once: true, passive: true });
        });
    </script>
    <noscript>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    </noscript>

    <!-- Google Fonts Optimizadas y Asincronas -->
    @if (!($data['fonts']['paragraph']['url'] ?? null))
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap">
    </noscript>
    @endif

    <!-- Pixel injection is handled by InjectPixelsMiddleware with cache -->
    @if ($data['fonts']['title']['url'] && $data['fonts']['title']['source'] == 'true')
    <link rel="preload" href="{{ $data['fonts']['title']['url'] }}" as="font" type="font/woff2" crossorigin="anonymous">
    @endif
    @if ($data['fonts']['paragraph']['url'] && $data['fonts']['paragraph']['source'] == 'true')
    <link rel="preload" href="{{ $data['fonts']['paragraph']['url'] }}" as="font" type="font/woff2" crossorigin="anonymous">
    @endif
    @if ($data['fonts']['title']['url'] && $data['fonts']['title']['source'] !== 'true')
    @php
        $titleFontUrl = $data['fonts']['title']['url'];
        if (strpos($titleFontUrl, 'fonts.googleapis.com') !== false && strpos($titleFontUrl, 'display=swap') === false) {
            $titleFontUrl .= (strpos($titleFontUrl, '?') !== false ? '&' : '?') . 'display=swap';
        }
    @endphp
    <link rel="preload" href="{{ $titleFontUrl }}" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript>
        <link rel="stylesheet" href="{{ $titleFontUrl }}">
    </noscript>
    @endif

    @if ($data['fonts']['paragraph']['url'] && $data['fonts']['paragraph']['source'] !== 'true')
    @php
        $paragraphFontUrl = $data['fonts']['paragraph']['url'];
        if (strpos($paragraphFontUrl, 'fonts.googleapis.com') !== false && strpos($paragraphFontUrl, 'display=swap') === false) {
            $paragraphFontUrl .= (strpos($paragraphFontUrl, '?') !== false ? '&' : '?') . 'display=swap';
        }
    @endphp
    <link rel="preload" href="{{ $paragraphFontUrl }}" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript>
        <link rel="stylesheet" href="{{ $paragraphFontUrl }}">
    </noscript>
    @endif

    @if(in_array($component, ['BlogArticle.jsx', 'Track.jsx', 'CourseDetails.jsx', 'PostDetails.jsx']))
    <script src="/lte/assets/libs/moment/min/moment.min.js" defer></script>
    <script src="/lte/assets/libs/moment/moment-timezone.js" defer></script>
    <script src="/lte/assets/libs/moment/locale/es.js" defer></script>
    @endif

    @vite(['resources/css/app.css', 'resources/js/' . Route::currentRouteName()])
    @inertiaHead



    @if ($component == 'BlogArticle.jsx')
    <link href="/lte/assets/libs/quill/quill.snow.css" rel="stylesheet" type="text/css" />
    <link href="/lte/assets/libs/quill/quill.bubble.css" rel="stylesheet" type="text/css" />
    <style>
        .ql-editor blockquote {
            border-left: 4px solid #f8b62c;
            padding-left: 16px;
        }

        .ql-editor img {
            border-radius: 8px;
        }
    </style>
    @endif
    <style>
        body {
            width: 100%;
            height: auto;
            background-size: 100% auto;
            background-repeat: no-repeat;
            background-position: top center;
        }
    </style>

    @if ($data['fonts']['title']['url'] && $data['fonts']['title']['source'] == 'true')
    <style>
        @font-face {
            font-family: "{{ $data['fonts']['title']['name'] }}";
            src: url('{{ $data['fonts']['title']['url'] }}') format('woff2');
            font-display: swap;
        }
    </style>
    @endif
    @if ($data['fonts']['title']['name'])
    <style>
        .font-title {
            font-family: "{{ $data['fonts']['title']['name'] }}", sans-serif;
        }
    </style>
    @endif
    @if ($data['fonts']['paragraph']['url'] && $data['fonts']['paragraph']['source'] == 'true')
    <style>
        @font-face {
            font-family: "{{ $data['fonts']['paragraph']['name'] }}";
            src: url('{{ $data['fonts']['paragraph']['url'] }}') format('woff2');
            font-display: swap;
        }
    </style>
    @endif
    @if ($data['fonts']['paragraph']['name'])
    <style>
        * {
            font-family: "{{ $data['fonts']['paragraph']['name'] }}", sans-serif;
        }
    </style>
    @endif

    <style>
        :root {
            @foreach ($data['colors'] as $color)
            --bg-{{ $color->name }}: {{ $color->description }};
            @endforeach
        }

        @foreach ($data['colors'] as $color)
            @if ($color->name === 'bg_primary_gradient' && !empty($color->description))
            .bg-primary {
                background-image: var(--bg-{{ $color->name }}) !important;
            }
            @endif
            .customtext-{{ $color->name }} {
                color: {{ $color->description }};
            }
            .hover\:customtext-{{ $color->name }}:hover {
                color: {{ $color->description }};
            }
            .active\:customtext-{{ $color->name }}:active {
                color: {{ $color->description }};
            }
            .placeholder\:customtext-{{ $color->name }}::placeholder {
                color: {{ $color->description }};
            }
        @endforeach

        .font-emoji {
            font-family: "Noto Color Emoji", sans-serif;
        }

        .select2-container--default .select2-selection--single .select2-selection__arrow {
            top: 50%;
            transform: translateY(-50%);
        }
    </style>

</head>

@php $bodyCustomHtml = $generals->where('correlative', 'body_custom_html')->first()?->description ?? ''; @endphp

@php $appColorPrimary = $data['colors']->firstWhere('name', 'primary')?->description ?? '#000000'; @endphp

<body class="font-paragraph relative" style="background: var(--bg-page-background);">
    @if($bodyCustomHtml) {!! $bodyCustomHtml !!} @endif


    @php
    $firstSlider = (isset($data['sliders']) && is_iterable($data['sliders']) && count($data['sliders']) > 0) ? $data['sliders'][0] : null;
    $heroTitle = $firstSlider?->name ?? $firstSlider?->seo_h1 ?? $pageTitle;
    $heroDesc = $firstSlider?->description ?? $pageDescription;
    @endphp

    <div id="app" data-page="{{ json_encode($page) }}">
        <!-- Critical Shell Pre-render para FCP/LCP instantáneo (< 300ms) -->
        <div id="critical-ssr-shell" style="min-height: 90vh; display: flex; flex-direction: column;">
            <header style="width: 100%; height: 70px; display: flex; align-items: center; justify-content: space-between; padding: 0 5%; border-bottom: 1px solid rgba(0,0,0,0.06);">
                <div style="font-weight: 800; font-size: 1.35rem; color: {{ $appColorPrimary }};">
                    {{ $siteTitle }}
                </div>
            </header>

            <main style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 3.5rem 5%; text-align: center;">
                <div style="max-width: 820px; margin: 0 auto;">
                    @if($heroTitle)
                    <h1 style="font-size: clamp(1.85rem, 4.5vw, 3.25rem); font-weight: 800; line-height: 1.18; margin-bottom: 1rem; color: inherit;">
                        {{ $heroTitle }}
                    </h1>
                    @endif
                    @if($heroDesc)
                    <p style="font-size: clamp(0.95rem, 1.8vw, 1.15rem); opacity: 0.85; max-width: 620px; margin: 0 auto; line-height: 1.6;">
                        {{ \Illuminate\Support\Str::limit(strip_tags($heroDesc), 170) }}
                    </p>
                    @endif
                </div>
            </main>
        </div>
    </div>
    @if($isCheckout)
    <script src="/lte/assets/js/vendor.min.js?v=<?php echo $version; ?>" defer></script>
    @endif

    @php
    $appColorPrimary = $data['colors']->firstWhere('name', 'primary')?->description ?? '#000000';
    @endphp
    <script type="text/javascript">
        window.APP_URL = "{{url('/')}}";
        window.APP_COLOR_PRIMARY = "<?php echo $appColorPrimary; ?>";
        window.APP_NAME = "<?php echo config('app.name', 'Mi Empresa'); ?>";
    </script>

    @if($isCheckout)
    @php
    $culqiEnabledRaw = $generals->where('correlative', 'checkout_culqi')->first()?->description ?? 'false';
    $culqiEnabled = in_array(strtolower($culqiEnabledRaw), ['true', '1', 'on', 'yes', 'si', 'enabled']);
    $culqiPublicKey = $generals->where('correlative', 'checkout_culqi_public_key')->first()?->description ?? '';
    $culqiRsaId = $generals->where('correlative', 'checkout_culqi_rsa_id')->first()?->description ?? '';
    $culqiRsaPublicKey = $generals->where('correlative', 'checkout_culqi_rsa_public_key')->first()?->description ?? '';
    @endphp
    @if($culqiEnabled && $culqiPublicKey)
    <script type="text/javascript" src="https://3ds.culqi.com"></script>
    <script type="text/javascript" src="https://js.culqi.com/checkout-js"></script>
    <script type="text/javascript">
        window.CULQI_PUBLIC_KEY = "<?php echo $culqiPublicKey; ?>";
        window.CULQI_ENABLED = true;
        @if($culqiRsaId && $culqiRsaPublicKey)
        window.CULQI_RSA_ID = "<?php echo $culqiRsaId; ?>";
        window.CULQI_RSA_PUBLIC_KEY = `<?php echo $culqiRsaPublicKey; ?>`;
        @endif
    </script>
    @else
    <script type="text/javascript">
        window.CULQI_ENABLED = false;
    </script>
    @endif

    @php
    $openpayEnabledRaw = $generals->where('correlative', 'checkout_openpay')->first()?->description ?? 'false';
    $openpayEnabled = in_array(strtolower($openpayEnabledRaw), ['true', '1', 'on', 'yes', 'si', 'enabled']);
    $openpayMerchantId = $generals->where('correlative', 'checkout_openpay_merchant_id')->first()?->description ?? '';
    $openpayPublicKey = $generals->where('correlative', 'checkout_openpay_public_key')->first()?->description ?? '';
    $openpayIsSandbox = $generals->where('correlative', 'checkout_openpay_sandbox_mode')->first()?->description ?? 'false';
    $openpayIsSandbox = in_array(strtolower($openpayIsSandbox), ['true', '1', 'on', 'yes', 'si']);
    @endphp
    @if($openpayEnabled && $openpayMerchantId && $openpayPublicKey)
    <script type="text/javascript" src="https://js.openpay.pe/openpay.v1.min.js"></script>
    <script type="text/javascript" src="https://js.openpay.pe/openpay-data.v1.min.js"></script>
    <script type="text/javascript">
        window.OPENPAY_MERCHANT_ID = "<?php echo $openpayMerchantId; ?>";
        window.OPENPAY_PUBLIC_KEY = "<?php echo $openpayPublicKey; ?>";
        window.OPENPAY_SANDBOX_MODE = <?php echo $openpayIsSandbox ? 'true' : 'false'; ?>;
    </script>
    @endif
    @else
    <script type="text/javascript">
        window.CULQI_ENABLED = false;
    </script>
    @endif

    @if($isCheckout)
    <script src="/lte/assets/libs/select2/js/select2.full.min.js?v=<?php echo $version; ?>" defer></script>
    @endif
 
    <script>
        // Carga diferida del tracker para no competir con el hilo principal móvil
        function loadEcommerceTracker() {
            if (window.__trackerLoaded) return;
            window.__trackerLoaded = true;
            const s = document.createElement('script');
            s.src = '/assets/js/ecommerce-tracker.js';
            s.defer = true;
            document.body.appendChild(s);
        }
        if ('requestIdleCallback' in window) {
            requestIdleCallback(loadEcommerceTracker, { timeout: 3500 });
        } else {
            setTimeout(loadEcommerceTracker, 2500);
        }
        ['touchstart', 'scroll', 'mousemove'].forEach(function(ev) {
            window.addEventListener(ev, loadEcommerceTracker, { once: true, passive: true });
        });

        document.addEventListener('click', function(event) {
            const target = event.target;
            if (target.tagName === 'BUTTON' && target.hasAttribute('href')) {
                const href = target.getAttribute('href');
                if (target.getAttribute('target') === '_blank') {
                    window.open(href, '_blank');
                } else {
                    location.href = href;
                }
            }
        });
    </script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            var lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));
            if ('IntersectionObserver' in window) {
                let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            let lazyImage = entry.target;
                            lazyImage.src = lazyImage.dataset.src;
                            lazyImage.classList.remove('lazy');
                            lazyImageObserver.unobserve(lazyImage);
                        }
                    });
                });
                lazyImages.forEach(function(lazyImage) {
                    lazyImageObserver.observe(lazyImage);
                });
            }
        });
    </script>
</body>

</html>