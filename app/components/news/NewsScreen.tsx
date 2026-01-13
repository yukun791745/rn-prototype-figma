import React from 'react';
import { Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { YouTubeSection } from './YouTubeSection';
import { FilterBar, NewsFilters } from './FilterBar';
import { NewsFeed } from './NewsFeed';
import { NewsItem } from './NewsFeedItem';
import { ArticleSummaryScreen, ArticleSummary } from './ArticleSummaryScreen';

interface NewsScreenProps {
  onSettingsClick?: () => void;
  initialSelectedArticleId?: string | null;
}

export function NewsScreen({ onSettingsClick, initialSelectedArticleId }: NewsScreenProps) {
  const [filters, setFilters] = React.useState<NewsFilters>({
    language: 'all',
    topic: 'all',
    media: 'all',
    source: 'all',
    autoTranslate: false,
  });

  const [selectedArticleId, setSelectedArticleId] = React.useState<string | null>(initialSelectedArticleId || null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const ITEMS_PER_PAGE = 10;
  
  // Update selected article when initialSelectedArticleId changes
  React.useEffect(() => {
    if (initialSelectedArticleId) {
      setSelectedArticleId(initialSelectedArticleId);
    }
  }, [initialSelectedArticleId]);

  // Mock YouTube data
  const youtubeConnected = true;
  const featuredVideo = {
    id: 'yt-1',
    title: '【トライアスロン】フルマラソンサブ3達成のための3つの秘訣',
    thumbnail: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80',
    publishedAt: '2日前',
    duration: '12:34',
  };

  const recentVideos = [
    {
      id: 'yt-2',
      title: 'スイムテクニック：効率的なストロークの作り方',
      thumbnail: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=400&q=80',
      duration: '8:45',
    },
    {
      id: 'yt-3',
      title: 'ロングライド準備：補給戦略を解説',
      thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
      duration: '15:20',
    },
    {
      id: 'yt-4',
      title: 'レース1週間前のテーパリング方法',
      thumbnail: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=400&q=80',
      duration: '10:12',
    },
    {
      id: 'yt-5',
      title: 'トランジション高速化のコツ',
      thumbnail: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400&q=80',
      duration: '6:30',
    },
    {
      id: 'yt-6',
      title: '初心者向け：トライアスロンギア選び',
      thumbnail: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&q=80',
      duration: '18:05',
    },
  ];

  // Mock news feed data
  const mockNewsItems: NewsItem[] = [
    {
      id: 'news-1',
      source: 'Triathlete',
      mediaType: 'article',
      language: 'en',
      title: '2026 IRONMAN World Championship Preview: Top Contenders to Watch',
      summary:
        "As we approach the 2026 IRONMAN World Championship, several athletes have emerged as strong contenders. From defending champions to rising stars, here's who to keep an eye on.",
      timestamp: '2時間前',
      url: '#',
      translatedTitle: '2026アイアンマン世界選手権プレビュー：注目すべきトップ候補選手',
      translatedSummary: '2026年のアイアンマン世界選手権が近づく中、ディフェンディングチャンピオンから新進気鋭の選手まで、多くの有力な候補者が台頭しています。',
    },
    {
      id: 'news-2',
      source: 'Triathlon Magazine',
      mediaType: 'article',
      language: 'jp',
      title: '冬のトレーニング戦略：オフシーズンを無駄にしない方法',
      summary:
        'オフシーズンは休息だけでなく、来シーズンに向けた基礎体力作りの絶好の機会です。効果的な冬トレーニングプログラムをご紹介します。',
      timestamp: '5時間前',
      url: '#',
    },
    {
      id: 'news-3',
      source: '220 Triathlon',
      mediaType: 'youtube',
      language: 'en',
      title: 'Nutrition Science: Optimal Carb Loading for Race Day Performance',
      summary:
        'New research reveals the most effective carbohydrate loading strategies for endurance athletes. Dr. Sarah Mitchell breaks down the latest findings and practical applications.',
      timestamp: '8時間前',
      url: '#',
      thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80',
      translatedTitle: '栄養科学：レース当日のパフォーマンスを最大化する最適なカーボローディング',
      translatedSummary: '最新の研究により、持久系アスリートにとって最も効果的な炭水化物摂取戦略が明らかになりました。サラ・ミッチェル博士が最新の知見と実践的な応用方法を解説します。',
    },
    {
      id: 'news-4',
      source: 'Slowtwitch',
      mediaType: 'article',
      language: 'en',
      title: 'Bike Fit Fundamentals: Why Professional Fitting Matters',
      summary:
        'A proper bike fit can improve performance, prevent injuries, and increase comfort. Learn what to expect from a professional fitting session and how to find the right fitter.',
      timestamp: '10時間前',
      url: '#',
      translatedTitle: 'バイクフィットの基礎：なぜプロフェッショナルなフィッティングが重要なのか',
      translatedSummary: '適切なバイクフィットは、パフォーマンスを向上させ、怪我を防ぎ、快適性を高めます。プロフェッショナルなフィッティングセッションで何が行われるか、そして適切なフィッターを見つける方法を学びましょう。',
    },
    {
      id: 'news-5',
      source: 'トライアスロンLumina',
      mediaType: 'podcast',
      language: 'jp',
      title: '【Podcast】プロ選手が語るメンタルトレーニングの重要性',
      summary:
        '今回のゲストは日本を代表するプロトライアスリート。レース当日のプレッシャーとの向き合い方、メンタルの鍛え方について語ります。',
      timestamp: '12時間前',
      url: '#',
    },
    {
      id: 'news-6',
      source: 'IRONMAN',
      mediaType: 'youtube',
      language: 'en',
      title: 'Recovery Techniques: Ice Baths vs Compression - What Works Best?',
      summary:
        'Athletes swear by different recovery methods, but what does the science say? We compare ice baths, compression gear, and other popular recovery techniques.',
      timestamp: '1日前',
      url: '#',
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
      translatedTitle: 'リカバリーテクニック：アイスバス vs コンプレッション - 何が最も効果的か？',
      translatedSummary: 'アスリートは様々なリカバリー方法を実践していますが、科学的にはどうなのでしょうか？アイスバス、コンプレッションギア、その他の人気のリカバリーテクニックを比較します。',
    },
    {
      id: 'news-7',
      source: 'トライアスロンWEB',
      mediaType: 'article',
      language: 'jp',
      title: '最新ウェットスーツ徹底比較：2026年モデルレビュー',
      summary:
        '各メーカーの最新ウェットスーツを実際に試泳してレビュー。浮力、柔軟性、価格帯別におすすめモデルをご紹介します。',
      timestamp: '1日前',
      url: '#',
    },
    {
      id: 'news-8',
      source: 'TrainingPeaks Blog',
      mediaType: 'youtube',
      language: 'en',
      title: 'Understanding TSS: How to Use Training Stress Score Effectively',
      summary:
        'Training Stress Score (TSS) is a powerful metric for managing training load. Learn how to interpret TSS data and apply it to your training plan for optimal results.',
      timestamp: '2日前',
      url: '#',
      thumbnail: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80',
      translatedTitle: 'TSSを理解する：トレーニングストレススコアを効果的に活用する方法',
      translatedSummary: 'トレーニングストレススコア（TSS）は、トレーニング負荷を管理するための強力な指標です。TSSデータを解釈し、最適な結果を得るためにトレーニング計画に適用する方法を学びましょう。',
    },
    {
      id: 'news-9',
      source: 'Runner\'s World',
      mediaType: 'article',
      language: 'en',
      title: 'Building Run Endurance: The 80/20 Training Method',
      summary:
        'The 80/20 principle suggests 80% of your training should be at low intensity and 20% at high intensity. Learn how to apply this proven method to your triathlon run training.',
      timestamp: '2日前',
      url: '#',
      translatedTitle: 'ランニング持久力の構築：80/20トレーニングメソッド',
      translatedSummary: '80/20の原則は、トレーニングの80%を低強度、20%を高強度で行うことを推奨しています。この実証済みの方法をトライアスロンのランニングトレーニングに適用する方法を学びましょう。',
    },
    {
      id: 'news-10',
      source: 'トライアスロンジャーナル',
      mediaType: 'article',
      language: 'jp',
      title: '初心者必見：トランジションエリアの効率的な使い方',
      summary:
        'トランジションはよく「第4の種目」と呼ばれます。スムーズなトランジションで数分の短縮が可能。実践的なテクニックを伝授します。',
      timestamp: '3日前',
      url: '#',
    },
    {
      id: 'news-11',
      source: 'Cycling Weekly',
      mediaType: 'youtube',
      language: 'en',
      title: 'Power Meter Guide: Choosing the Right Device for Triathlon',
      summary:
        'Power meters have become essential for serious triathletes. This comprehensive guide covers different types, accuracy, and which one fits your training needs and budget.',
      timestamp: '3日前',
      url: '#',
      thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
      translatedTitle: 'パワーメーターガイド：トライアスロンに適したデバイスの選び方',
      translatedSummary: 'パワーメーターは本格的なトライアスリートにとって必須となっています。この包括的なガイドでは、様々なタイプ、精度、そしてトレーニングニーズと予算に適したものを紹介します。',
    },
    {
      id: 'news-12',
      source: 'SwimSwam',
      mediaType: 'article',
      language: 'en',
      title: 'Open Water Swimming Tips: From Pool to Lake Transition',
      summary:
        'Moving from pool swimming to open water can be challenging. Professional coaches share their top tips for adapting your technique and building confidence in open water.',
      timestamp: '4日前',
      url: '#',
      translatedTitle: 'オープンウォータースイミングのコツ：プールから湖への移行',
      translatedSummary: 'プールスイミングからオープンウォーターへの移行は困難な場合があります。プロのコーチが、テクニックの適応とオープンウォーターでの自信構築のためのトップヒントを共有します。',
    },
    {
      id: 'news-13',
      source: 'トライアスロンLumina',
      mediaType: 'article',
      language: 'jp',
      title: '夏のレース対策：暑熱順化トレーニングのすべて',
      summary:
        '猛暑の中でのレースは体温調節が鍵。レース2週間前から始める暑熱順化トレーニングで、暑さに強い体を作りましょう。',
      timestamp: '4日前',
      url: '#',
    },
    {
      id: 'news-14',
      source: 'Triathlete',
      mediaType: 'podcast',
      language: 'en',
      title: 'Interview: Olympic Champion on Balancing Speed and Endurance',
      summary:
        'Olympic gold medalist shares insights on how to balance speed work with endurance training, mental preparation techniques, and lessons learned from years of competing at the highest level.',
      timestamp: '5日前',
      url: '#',
      translatedTitle: 'インタビュー：オリンピックチャンピオンが語るスピードと持久力のバランス',
      translatedSummary: 'オリンピック金メダリストが、スピードワークと持久力トレーニングのバランス、メンタル準備のテクニック、そして最高レベルで競ってきた年月から学んだ教訓を語ります。',
    },
    {
      id: 'news-15',
      source: 'トライアスロンWEB',
      mediaType: 'youtube',
      language: 'jp',
      title: 'ロングライド完全ガイド：100km超えの準備と実践',
      summary:
        '100kmを超えるロングライドを成功させるための準備から当日の走り方まで、プロコーチが詳しく解説します。',
      timestamp: '5日前',
      url: '#',
      thumbnail: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80',
    },
    {
      id: 'news-16',
      source: '220 Triathlon',
      mediaType: 'article',
      language: 'en',
      title: 'Race Day Nutrition: What to Eat Before, During, and After',
      summary:
        'Nutrition can make or break your race. Sports nutritionist breaks down the optimal eating strategy for sprint, Olympic, and IRONMAN distance races.',
      timestamp: '6日前',
      url: '#',
      translatedTitle: 'レース当日の栄養：前・中・後に何を食べるべきか',
      translatedSummary: '栄養はレースの成否を分けます。スポーツ栄養士が、スプリント、オリンピック、アイアンマンディスタンスのレースに最適な食事戦略を解説します。',
    },
    {
      id: 'news-17',
      source: 'Slowtwitch',
      mediaType: 'article',
      language: 'en',
      title: 'Aero Wheels vs Lightweight: Which is Better for Triathlon?',
      summary:
        'The eternal debate: should you invest in aero wheels or lightweight climbing wheels? We analyze the data and help you make the right choice for your racing.',
      timestamp: '6日前',
      url: '#',
      translatedTitle: 'エアロホイール vs 軽量ホイール：トライアスロンにはどちらが良いか？',
      translatedSummary: '永遠の議論：エアロホイールと軽量クライミングホイール、どちらに投資すべきか？データを分析し、レースに適した選択をサポートします。',
    },
    {
      id: 'news-18',
      source: 'Triathlon Magazine',
      mediaType: 'article',
      language: 'jp',
      title: 'ケガ予防のためのストレングストレーニング入門',
      summary:
        'トライアスロンは長時間の反復運動によりケガのリスクが高まります。週2回のストレングストレーニングで筋力バランスを整えましょう。',
      timestamp: '7日前',
      url: '#',
    },
    {
      id: 'news-19',
      source: 'IRONMAN',
      mediaType: 'youtube',
      language: 'en',
      title: 'Mental Toughness: Strategies for Pushing Through the Pain Cave',
      summary:
        'Every long-distance triathlete faces the "pain cave." Sports psychologist shares proven mental strategies to overcome difficult moments during training and racing.',
      timestamp: '7日前',
      url: '#',
      thumbnail: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=400&q=80',
      translatedTitle: 'メンタルタフネス：ペインケーブを乗り越えるための戦略',
      translatedSummary: 'すべてのロングディスタンストライアスリートは「ペインケーブ（苦痛の洞窟）」に直面します。スポーツ心理学者が、トレーニングとレース中の困難な瞬間を乗り越えるための実証済みのメンタル戦略を共有します。',
    },
    {
      id: 'news-20',
      source: 'トライアスロンジャーナル',
      mediaType: 'article',
      language: 'jp',
      title: '初めてのロング完走！アイアンマン70.3レースレポート',
      summary:
        '初めてのアイアンマン70.3に挑戦したアスリートのリアルなレースレポート。準備期間、当日の様子、反省点までを詳細に綴ります。',
      timestamp: '1週間前',
      url: '#',
    },
    {
      id: 'news-21',
      source: 'TrainingPeaks Blog',
      mediaType: 'article',
      language: 'en',
      title: 'Periodization Basics: How to Structure Your Training Year',
      summary:
        'Learn how to periodize your training for peak performance. From base building to race-specific prep, discover how to structure your season for optimal results.',
      timestamp: '1週間前',
      url: '#',
      translatedTitle: 'ピリオダイゼーションの基礎：トレーニング年間計画の組み方',
      translatedSummary: 'ピークパフォーマンスのためにトレーニングをピリオダイゼーションする方法を学びましょう。基礎構築からレース特化の準備まで、最適な結果を得るためのシーズン構成を学びます。',
    },
    {
      id: 'news-22',
      source: 'Cycling Tips',
      mediaType: 'youtube',
      language: 'en',
      title: 'Bike Maintenance 101: Essential Skills Every Triathlete Should Know',
      summary:
        'Avoid mechanical issues on race day by mastering these essential bike maintenance skills. From fixing a flat to adjusting your gears, we cover everything you need to know.',
      timestamp: '1週間前',
      url: '#',
      thumbnail: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&q=80',
      translatedTitle: 'バイクメンテナンス入門：すべてのトライアスリートが知っておくべき必須スキル',
      translatedSummary: 'これらの必須バイクメンテナンススキルをマスターして、レース当日の機械的トラブルを回避しましょう。パンク修理からギア調整まで、知っておくべきすべてをカバーします。',
    },
    {
      id: 'news-23',
      source: 'トライアスロンLumina',
      mediaType: 'podcast',
      language: 'jp',
      title: '【Podcast】プロコーチに聞く：レースペース戦略の立て方',
      summary:
        'レースで力を発揮するためには適切なペース戦略が不可欠。経験豊富なプロコーチがレースごとのペース戦略を解説します。',
      timestamp: '1週間前',
      url: '#',
    },
    {
      id: 'news-24',
      source: 'Runner\'s World',
      mediaType: 'article',
      language: 'en',
      title: 'Injury Prevention: Common Running Injuries and How to Avoid Them',
      summary:
        'Runner\'s knee, plantar fasciitis, IT band syndrome - learn about the most common running injuries in triathlon and evidence-based strategies to prevent them.',
      timestamp: '1週間前',
      url: '#',
      translatedTitle: 'ケガ予防：よくあるランニングケガとその回避方法',
      translatedSummary: 'ランナー膝、足底筋膜炎、腸脛靭帯症候群など、トライアスロンで最もよくあるランニングケガと、それらを予防するためのエビデンスに基づいた戦略を学びましょう。',
    },
    {
      id: 'news-25',
      source: 'トライアスロンWEB',
      mediaType: 'article',
      language: 'jp',
      title: '2026年注目のトライアスロン大会カレンダー',
      summary:
        '国内外の主要トライアスロン大会をまとめました。エントリー開始日や特徴、難易度なども詳しく紹介します。',
      timestamp: '2週間前',
      url: '#',
    },
  ];

  // Mock article summaries
  const mockArticleSummaries: Record<string, ArticleSummary> = {
    'news-1': {
      id: 'news-1',
      originalTitle: '2026 IRONMAN World Championship Preview: Top Contenders to Watch',
      translatedTitle: '2026アイアンマン世界選手権プレビュー：注目すべきトップ候補選手',
      source: 'Triathlete',
      publishedAt: '2時間前',
      mediaType: 'article',
      url: 'https://www.triathlete.com/example',
      aiSummary: {
        overview:
          '2026年のアイアンマン世界選手権に向けて、ディフェンディングチャンピオンから新進気鋭の選手まで、多くの有力な候補者が台頭しています。男子はグスタフ・イーデンとサム・レイドローが引き続き強力な存在感を示し、女子はルーシー・チャールズ=バークレーとアン・ハウグが優勝候補の筆頭に挙げられています。また、若手選手の台頭も目覚ましく、今年は予測が難しいレースになりそうです。',
        keyPoints: [
          '男子部門ではグスタフ・イーデンが2連覇を目指し、昨シーズンからの好調を維持しています。彼のバイクとランの強さは群を抜いており、ライバルたちは彼を上回る戦略を練る必要があります。',
          '女子部門ではルーシー・チャールズ=バークレーが悲願の初優勝を目指しています。過去数年間で2位を何度も経験している彼女にとって、今年こそがチャンスとなるでしょう。',
          'スイムで大きなアドバンテージを取れる選手が有利とされており、コナのコンディション次第ではレース展開が大きく変わる可能性があります。',
          '若手選手の中では、マグナス・ディスレフ（ノルウェー）とキャサリン・バーティン（カダ）が初のポディウムフィニッシュを狙える位置につけています。',
        ],
        implicationsForAthletes:
          'トップ選手たちの戦略から学べる重要なポイントは、種目ごとの強みを最大化しつつ、弱点を最小限に抑えるバランスの取り方です。また、レース当日のコンディションや気象条件に合わせた柔軟な戦術変更が勝敗を分ける鍵となります。アマチュアアスリートも、自分の強みを明確にし、それを活かせるレース選びやペース配分を意識することで、より良い結果につながるでしょう。',
      },
    },
    'news-3': {
      id: 'news-3',
      originalTitle: 'Nutrition Science: Optimal Carb Loading for Race Day Performance',
      translatedTitle: '栄養科学：レース当日のパフォーマンスを最大化する最適なカーボローディング',
      source: '220 Triathlon',
      publishedAt: '8時間前',
      mediaType: 'youtube',
      url: 'https://www.youtube.com/example',
      aiSummary: {
        overview:
          '最新の栄養科学研究により、従来のカーボローディング手法が見直されています。サラ・ミッチェル博士による新しい研究では、レース3日前からの段階的な炭水化物摂取と、レース当日朝の摂取タイミングが、パフォーマンスに大きな影響を与えることが明らかになりました。特に、体重1kgあたり8-12gの炭水化物を3日間摂取することで、筋グリコーゲン貯蔵量を最大化できるとされています。',
        keyPoints: [
          'レース3日前から段階的に炭水化物摂取量を増やし、最終日には体重1kgあたり10-12gを目標にすることで、最適なグリコーゲン貯蔵が可能になります。',
          'レース当日の朝食は、スタート3-4時間前に摂取し、消化しやすい炭水化物（白米、バナナ、トーストなど）を中心に構成することが推奨されます。',
          '脂質とタンパク質は通常通りの摂取量を維持し、炭水化物のみを増やすことで、消化器系への負担を最小限に抑えられます。',
          'カーボローディング期間中は、トレーニング強度を下げることが重要です。激しい運動は貯蔵したグリコーゲンを消費してしまうため、軽い運動やストレッチに留めましょう。',
        ],
        implicationsForAthletes:
          'トライアスリートにとって、適切なカーボローディングは長時間のレースを乗り切るための必須戦略です。特にアイアンマンやロングディスタンスのレースでは、エネルギー切れがパフォーマンス低下の最大の原因となるため、レース前の炭水化物戦略を綿密に計画することが成功の鍵となります。個人差があるため、レース前に何度か試行し、自分に最適な方法を見つけることが重要です。',
      },
    },
    'news-4': {
      id: 'news-4',
      originalTitle: 'Bike Fit Fundamentals: Why Professional Fitting Matters',
      translatedTitle: 'バイクフィットの基礎：なぜプロフェッショナルなフィッティングが重要なのか',
      source: 'Slowtwitch',
      publishedAt: '10時間前',
      mediaType: 'article',
      url: 'https://www.slowtwitch.com/example',
      aiSummary: {
        overview:
          'プロフェッショナルなバイクフィッティングは、単なる快適性の向上だけでなく、パフォーマンスの最大化と怪我の予防において極めて重要な役割を果たします。適切なポジションは、空気抵抗の削減、パワー出力の最適化、長時間ライドでの疲労軽減につながります。この記事では、フィッティングセッションで何が行われるか、そして適切なフィッターを見つける方法について詳しく解説しています。',
        keyPoints: [
          'プロフェッショナルなバイクフィッティングは、体測定、柔軟性評価、ライディングスタイル分析を含む包括的なプロセスです。',
          '適切なサドル高さは、ペダリング効率に直接影響します。一般的に、脚がほぼ伸びきった状態で、わずかな膝の曲がりが残る高さが理想的です。',
          'エアロポジションは速度向上に寄与しすが、無理な姿勢は持続できず、結果的にパフォーマンスを低下させる可能性があります。快適性とエアロダイナミクスのバランスが重要です。',
          '経験豊富なフィッターは、トライアスロン特有の要件（トランジション後のラン、長時間のエアロポジション維持など）を理解しており、それに応じた調整を行います。',
        ],
        implicationsForAthletes:
          'トライアスリートは、バイクパートでのパフォーマンスがレース全体の結果に大きく影響することを理解しています。適切なバイクフィッティングは、単に速く走るだけでなく、ランパートに向けてエネルギーを温存し、怪我のリスクを最小限に抑える上で不可欠です。特ロングディスタンスのレースでは、わずかなポジションの違いが数時間後に大きな差となって現れます。投資に見合う価値は十分にあると言えるでしょう。',
      },
    },
    'news-6': {
      id: 'news-6',
      originalTitle: 'Recovery Techniques: Ice Baths vs Compression - What Works Best?',
      translatedTitle: 'リカバリーテクニック：アイスバス vs コンプレッション - 何が最も効果的か？',
      source: 'IRONMAN',
      publishedAt: '1日前',
      mediaType: 'youtube',
      url: 'https://www.youtube.com/example',
      aiSummary: {
        overview:
          'アスリートの間で人気の高いリカバリー方法には、アイスバス、コンプレッションウェア、アクティブリカバリーなどがありますが、科学的根拠はどうなっているのでしょうか？この動画では、最新の研究結果を基に、各リカバリー手法の効果を比較検証しています。結論として、どの方法も一定の効果がありますが、個人差や使用タイミングによって最適な方法は異なるようです。',
        keyPoints: [
          'アイスバス（冷水浴）は、激しいトレーニング直後の炎症を抑え、筋肉痛を軽減する効果がありますが、筋肥大を目指す場合は避けるべきです。',
          'コンプレッションウェアは、血流を促進し、むくみを減らす効果があり、特にトレーニング後の回復期間や移動中に有効です。',
          'アクティブリカバリー（軽い運動）は、血流を増やし老廃物の排出を促進するため、多くのアスリートにとって最も効果的な方法の一つです。',
          '睡眠と栄養は、どのリカバリー手法よりも重要であり、これらの基本をおろそかにしてはいけません。',
        ],
        implicationsForAthletes:
          'トライアスリートは、スイム、バイク、ランの3種目をこなすため、効果的なリカバリー戦略が不可欠です。重要なポイントは、単一の方法に依存するのではなく、トレーニングサイクルや疲労度に応じて複数の手法を組み合わせることです。例えば、高強度トレーニング後はアイスバス、軽いトレーニング後はアクティブリカバリー、就寝時はコンプレッションウェアといった使い分けが効果的です。',
      },
    },
    'news-8': {
      id: 'news-8',
      originalTitle: 'Understanding TSS: How to Use Training Stress Score Effectively',
      translatedTitle: 'TSSを理解する：トレーニングストレススコアを効果的に活用する方法',
      source: 'TrainingPeaks Blog',
      publishedAt: '2日前',
      mediaType: 'youtube',
      url: 'https://www.youtube.com/example',
      aiSummary: {
        overview:
          'Training Stress Score (TSS) は、トレーニング負荷を定量化するための強力な指標です。この動画では、TSSの基本概念から、CTL（Chronic Training Load：慢性トレーニング負荷）、ATL（Acute Training Load：急性トレーニング負荷）、TSB（Training Stress Balance：トレーニングストレスバランス）の関係性まで、包括的に解説しています。これらの指標を正しく理解し活用することで、オーバートレーニングを防ぎ、パフォーマンスを最大化できます。',
        keyPoints: [
          'TSSは、トレーニングの強度と時間を組み合わせて計算され、1時間のFTP（機能的作業閾値パワー）走行が100TSSに相当します。',
          'CTLは過去6週間の平均的なトレーニング負荷を示し、フィットネスレベルの指標となります。CTLが高いほど、より多くのトレーニング負荷に耐えられます。',
          'ATLは過去7日間のトレーニング負荷を示し、現在の疲労度を表します。ATLが高すぎる場合は、休息が必要なサインです。',
          'TSB（= CTL - ATL）はレースに向けたコンディションの指標であり、レース当日に+5〜+25の範囲になるよう調整することが推奨されます。',
        ],
        implicationsForAthletes:
          'トライアスリートにとって、TSSとその関連指標は、科学的なトレーニング計画を立てる上で非常に有用です。特に、オフシーズンからレースシーズンへの移行期や、重要なレースに向けたテーパリング期間において、これらの数値を参考にすることで、最適なコンディションレースに臨むことができます。ただし、数値だけに頼らず、身体の感覚や疲労度も考慮することが重要です。',
      },
    },
  };

  const handleVideoPlay = (videoId: string) => {
    console.log('Play video:', videoId);
    // Implement video playback
  };

  const handleConnectYouTube = () => {
    console.log('Connect YouTube channel');
    // Implement YouTube connection
  };

  const handleViewJapaneseSummary = (itemId: string) => {
    console.log('View Japanese summary for item:', itemId);
    setSelectedArticleId(itemId);
  };

  const handleManageSources = () => {
    console.log('Manage sources');
    // Implement source management
  };

  const handleItemClick = (url: string) => {
    console.log('Open URL:', url);
    // Implement external link opening
  };

  const handleBackToList = () => {
    setSelectedArticleId(null);
  };

  const handleReadOriginal = () => {
    if (selectedArticleId && mockArticleSummaries[selectedArticleId]) {
      const article = mockArticleSummaries[selectedArticleId];
      window.open(article.url, '_blank');
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate pagination
  const totalItems = mockNewsItems.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = mockNewsItems.slice(startIndex, endIndex);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  // Show Article Summary Screen if an article is selected
  if (selectedArticleId && mockArticleSummaries[selectedArticleId]) {
    return (
      <ArticleSummaryScreen
        article={mockArticleSummaries[selectedArticleId]}
        onBackToList={handleBackToList}
        onReadOriginal={handleReadOriginal}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/40">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-slate-800">
              ニュース / 動画
            </h1>
            <p className="text-[11px] text-slate-500 mt-0.5">
              最新情報をまとめてチェック
            </p>
          </div>
          <button
            onClick={onSettingsClick}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* YouTube Section - Only show on page 1 */}
      {currentPage === 1 && (
        <div className="pt-4 bg-slate-50">
          <YouTubeSection
            isConnected={youtubeConnected}
            featuredVideo={featuredVideo}
            recentVideos={recentVideos}
            onConnect={handleConnectYouTube}
            onVideoPlay={handleVideoPlay}
          />
        </div>
      )}

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        onManageSources={handleManageSources}
      />

      {/* News Feed */}
      <div className="pt-4">
        <NewsFeed
          items={currentItems}
          autoTranslate={filters.autoTranslate}
          onViewJapaneseSummary={handleViewJapaneseSummary}
          onItemClick={handleItemClick}
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 space-y-2">
          {/* Page info */}
          <div className="text-center">
            <p className="text-[10px] text-slate-500">
              {startIndex + 1}〜{Math.min(endIndex, totalItems)}件 / 全{totalItems}件
            </p>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-center gap-2">
            {hasPrevPage && (
              <button
                onClick={handlePrevPage}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 font-medium text-xs rounded-lg shadow-sm transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>前へ</span>
              </button>
            )}

            {/* Page indicator */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-7 h-7 rounded-lg font-semibold text-[11px] transition-all ${
                    page === currentPage
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            {hasNextPage && (
              <button
                onClick={handleNextPage}
                className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold text-xs rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                <span>次へ</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bottom spacing */}
      <div className="h-16"></div>
    </div>
  );
}