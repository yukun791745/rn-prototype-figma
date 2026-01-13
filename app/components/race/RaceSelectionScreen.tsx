import React from 'react';
import { Search, ChevronDown, Calendar, MapPin, Trophy, ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface Race {
  id: string;
  name: string;
  date: string;
  location: string;
  distance: 'sprint' | 'olympic' | 'middle' | 'full';
  category: string;
  status: 'open' | 'upcoming' | 'closed';
  region: string;
  month: string;
}

export interface SelectedRace extends Race {
  priority: 'A' | 'B' | 'C';
}

interface RaceSelectionScreenProps {
  onBack: () => void;
  onRacesSelected?: (selectedRaces: SelectedRace[]) => void;
  initialSelectedRaces?: SelectedRace[];
}

export function RaceSelectionScreen({ onBack, onRacesSelected, initialSelectedRaces = [] }: RaceSelectionScreenProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedRegion, setSelectedRegion] = React.useState<string>('all');
  const [selectedDistance, setSelectedDistance] = React.useState<string>('all');
  const [selectedMonth, setSelectedMonth] = React.useState<string>('all');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [selectedRaces, setSelectedRaces] = React.useState<SelectedRace[]>(initialSelectedRaces);
  const [showRegionFilter, setShowRegionFilter] = React.useState(false);
  const [showDistanceFilter, setShowDistanceFilter] = React.useState(false);
  const [showMonthFilter, setShowMonthFilter] = React.useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 20;
  const [confirmDialog, setConfirmDialog] = React.useState<{ race: Race } | null>(null);
  const [isSelectedRacesExpanded, setIsSelectedRacesExpanded] = React.useState(false);

  // Mock race data
  const mockRaces: Race[] = [
    {
      id: 'race-1',
      name: 'IRONMAN New Zealand',
      date: '2026年3月7日',
      location: 'タウポ（NZ）',
      distance: 'full',
      category: 'IRONMAN',
      status: 'open',
      region: '海外',
      month: '3月',
    },
    {
      id: 'race-2',
      name: 'IRONMAN 70.3 Japan',
      date: '2026年5月24日',
      location: '東京',
      distance: 'middle',
      category: 'IRONMAN',
      status: 'open',
      region: '関東',
      month: '5月',
    },
    {
      id: 'race-3',
      name: '宮古島トライアスロン',
      date: '2026年4月19日',
      location: '宮古島（沖縄）',
      distance: 'full',
      category: '国内大会',
      status: 'open',
      region: '沖縄',
      month: '4月',
    },
    {
      id: 'race-4',
      name: '横浜トライアスロン',
      date: '2026年5月17日',
      location: '横浜',
      distance: 'olympic',
      category: '国内大会',
      status: 'open',
      region: '関東',
      month: '5月',
    },
    {
      id: 'race-5',
      name: 'Challenge Roth',
      date: '2026年7月12日',
      location: 'ロート（ドイツ）',
      distance: 'full',
      category: 'Challenge',
      status: 'upcoming',
      region: '海外',
      month: '7月',
    },
    {
      id: 'race-6',
      name: '九十九里トライアスロン',
      date: '2026年9月13日',
      location: '千葉',
      distance: 'olympic',
      category: '国内大会',
      status: 'upcoming',
      region: '関東',
      month: '9月',
    },
    {
      id: 'race-7',
      name: 'IRONMAN World Championship',
      date: '2026年10月10日',
      location: 'ハワイ島',
      distance: 'full',
      category: 'IRONMAN',
      status: 'upcoming',
      region: '海外',
      month: '10月',
    },
    {
      id: 'race-8',
      name: '佐渡国際トライアスロン',
      date: '2026年9月6日',
      location: '新潟',
      distance: 'full',
      category: '国内大会',
      status: 'open',
      region: '北陸',
      month: '9月',
    },
    {
      id: 'race-9',
      name: '石垣島トライアスロン',
      date: '2026年4月12日',
      location: '石垣島（沖縄）',
      distance: 'olympic',
      category: '国内大会',
      status: 'open',
      region: '沖縄',
      month: '4月',
    },
    {
      id: 'race-10',
      name: 'IRONMAN 70.3 Cairns',
      date: '2026年6月14日',
      location: 'ケアンズ（豪州）',
      distance: 'middle',
      category: 'IRONMAN',
      status: 'open',
      region: '海外',
      month: '6月',
    },
    {
      id: 'race-11',
      name: 'IRONMAN Malaysia',
      date: '2026年11月28日',
      location: 'ランカウイ島',
      distance: 'full',
      category: 'IRONMAN',
      status: 'open',
      region: '海外',
      month: '11月',
    },
    {
      id: 'race-12',
      name: '皆生トライアスロン',
      date: '2026年7月19日',
      location: '鳥取',
      distance: 'full',
      category: '国内大会',
      status: 'open',
      region: '関西',
      month: '7月',
    },
    {
      id: 'race-13',
      name: 'Challenge Taiwan',
      date: '2026年3月21日',
      location: '台湾',
      distance: 'middle',
      category: 'Challenge',
      status: 'open',
      region: '海外',
      month: '3月',
    },
    {
      id: 'race-14',
      name: 'お台場トライアスロン',
      date: '2026年8月22日',
      location: '東京',
      distance: 'sprint',
      category: '国内大会',
      status: 'upcoming',
      region: '関東',
      month: '8月',
    },
    {
      id: 'race-15',
      name: 'IRONMAN 70.3 Phuket',
      date: '2026年11月8日',
      location: 'プーケット',
      distance: 'middle',
      category: 'IRONMAN',
      status: 'open',
      region: '海外',
      month: '11月',
    },
    {
      id: 'race-16',
      name: '村上・笹川流れトライアスロン',
      date: '2026年9月20日',
      location: '新潟',
      distance: 'olympic',
      category: '国内大会',
      status: 'open',
      region: '北陸',
      month: '9月',
    },
    {
      id: 'race-17',
      name: 'IRONMAN 70.3 Dubai',
      date: '2026年2月5日',
      location: 'ドバイ',
      distance: 'middle',
      category: 'IRONMAN',
      status: 'closed',
      region: '海外',
      month: '2月',
    },
    {
      id: 'race-18',
      name: '天草国際トライアスロン',
      date: '2026年6月21日',
      location: '熊本',
      distance: 'olympic',
      category: '国内大会',
      status: 'open',
      region: '九州',
      month: '6月',
    },
    {
      id: 'race-19',
      name: 'Challenge Cancun',
      date: '2026年4月26日',
      location: 'カンクン',
      distance: 'full',
      category: 'Challenge',
      status: 'open',
      region: '海外',
      month: '4月',
    },
    {
      id: 'race-20',
      name: '東京ベイ・スプリント',
      date: '2026年6月7日',
      location: '東京',
      distance: 'sprint',
      category: '国内大会',
      status: 'open',
      region: '関東',
      month: '6月',
    },
    {
      id: 'race-21',
      name: 'IRONMAN Cozumel',
      date: '2026年11月22日',
      location: 'コスメル',
      distance: 'full',
      category: 'IRONMAN',
      status: 'upcoming',
      region: '海外',
      month: '11月',
    },
    {
      id: 'race-22',
      name: '五島長崎国際トライアスロン',
      date: '2026年6月28日',
      location: '長崎',
      distance: 'full',
      category: '国内大会',
      status: 'open',
      region: '九州',
      month: '6月',
    },
    {
      id: 'race-23',
      name: 'IRONMAN 70.3 Central Japan',
      date: '2026年8月30日',
      location: '愛知',
      distance: 'middle',
      category: 'IRONMAN',
      status: 'upcoming',
      region: '中部',
      month: '8月',
    },
    {
      id: 'race-24',
      name: 'びわ湖トライアスロン',
      date: '2026年7月5日',
      location: '滋賀',
      distance: 'olympic',
      category: '国内大会',
      status: 'open',
      region: '関西',
      month: '7月',
    },
    {
      id: 'race-25',
      name: 'Challenge Barcelona',
      date: '2026年10月4日',
      location: 'バルセロナ',
      distance: 'full',
      category: 'Challenge',
      status: 'upcoming',
      region: '海外',
      month: '10月',
    },
  ];

  const regions = ['all', '関東', '関西', '北陸', '沖縄', '海外'];
  const distances = [
    { value: 'all', label: 'すべて' },
    { value: 'sprint', label: 'ショート' },
    { value: 'olympic', label: 'スタンダード' },
    { value: 'middle', label: 'ミドル' },
    { value: 'full', label: 'ロング' },
  ];
  const months = ['all', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月'];
  const categories = ['all', 'IRONMAN', 'Challenge', '国内大会'];

  const getDistanceLabel = (distance: string): string => {
    const found = distances.find((d) => d.value === distance);
    return found ? found.label : distance;
  };

  const getStatusColor = (status: Race['status']): string => {
    switch (status) {
      case 'open':
        return 'bg-[rgba(102,102,255,0.1)] text-[#6666FF]';
      case 'upcoming':
        return 'bg-[rgba(0,102,255,0.1)] text-[#0066FF]';
      case 'closed':
        return 'bg-slate-100 text-slate-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'open':
        return '受付中';
      case 'upcoming':
        return '準備中';
      case 'closed':
        return '終了';
      default:
        return status;
    }
  };

  const toggleRaceSelection = (race: Race) => {
    const isSelected = selectedRaces.some((r) => r.id === race.id);
    if (isSelected) {
      // Remove selection
      setSelectedRaces((prev) => prev.filter((r) => r.id !== race.id));
    } else {
      // Show confirmation dialog
      setConfirmDialog({ race });
    }
  };

  const confirmRaceSelection = (priority: 'A' | 'B' | 'C') => {
    if (confirmDialog) {
      const { race } = confirmDialog;
      setSelectedRaces((prev) => [...prev, { ...race, priority }]);
      setConfirmDialog(null);
    }
  };

  const cancelRaceSelection = () => {
    setConfirmDialog(null);
  };

  const getPriorityColor = (priority: 'A' | 'B' | 'C') => {
    switch (priority) {
      case 'A':
        return 'border-[#FF33CC] bg-[#FF33CC]/10';
      case 'B':
        return 'border-[#0066FF] bg-[#0066FF]/10';
      case 'C':
        return 'border-[#6666FF] bg-[#6666FF]/10';
    }
  };

  const getPriorityBadgeColor = (priority: 'A' | 'B' | 'C') => {
    switch (priority) {
      case 'A':
        return 'bg-[#FF33CC] text-white';
      case 'B':
        return 'bg-[#0066FF] text-white';
      case 'C':
        return 'bg-[#6666FF] text-white';
    }
  };

  const handleGoalSetting = () => {
    if (onRacesSelected) {
      onRacesSelected(selectedRaces);
    }
  };

  const handleBack = () => {
    // Save selected races before going back
    if (onRacesSelected) {
      onRacesSelected(selectedRaces);
    }
    onBack();
  };

  // Reset page to 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedRegion, selectedDistance, selectedMonth, selectedCategory, searchQuery]);

  // Filter races
  const filteredRaces = mockRaces.filter((race) => {
    const matchesSearch =
      searchQuery === '' ||
      race.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      race.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || race.region === selectedRegion;
    const matchesDistance = selectedDistance === 'all' || race.distance === selectedDistance;
    const matchesMonth = selectedMonth === 'all' || race.month === selectedMonth;
    const matchesCategory = selectedCategory === 'all' || race.category === selectedCategory;

    return matchesSearch && matchesRegion && matchesDistance && matchesMonth && matchesCategory;
  });

  const selectedRaceObjects = mockRaces.filter((race) => selectedRaces.some((r) => r.id === race.id));

  const totalPages = Math.ceil(filteredRaces.length / itemsPerPage);
  const currentRaces = filteredRaces.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const sortedSelectedRaces = [...selectedRaces].sort((a, b) => {
    const priorityOrder = { 'A': 1, 'B': 2, 'C': 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header - sticky positioning with higher z-index */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        {/* Selected Races Panel - Collapsible */}
        {selectedRaces.length > 0 && (
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-200">
            <div className="px-4 py-3">
              <button
                onClick={() => setIsSelectedRacesExpanded(!isSelectedRacesExpanded)}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-indigo-800">
                    選択済み: {selectedRaces.length}件
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-indigo-600 transition-transform ${isSelectedRacesExpanded ? 'rotate-180' : ''}`} />
              </button>

              {isSelectedRacesExpanded && (
                <div className="mt-2 space-y-1.5 max-h-40 overflow-y-auto">
                  {sortedSelectedRaces.map((race) => (
                    <div
                      key={race.id}
                      className="bg-white rounded-lg px-2.5 py-2 border border-slate-200"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${getPriorityBadgeColor(race.priority)}`}>
                              {race.priority}
                            </span>
                            <h3 className="text-[11px] font-bold text-slate-800 truncate">{race.name}</h3>
                          </div>
                          <p className="text-[10px] text-slate-600">{race.date}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRaceSelection(race);
                          }}
                          className="p-1 hover:bg-rose-50 rounded transition-all"
                        >
                          <X className="w-3.5 h-3.5 text-rose-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Title and Back Button */}
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-slate-800">レース選択</h1>
              <p className="text-xs text-slate-500 mt-0.5">参加予定の大会を選んでください</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="大会名・場所で検索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {/* Region Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRegionFilter(!showRegionFilter);
                setShowDistanceFilter(false);
                setShowMonthFilter(false);
                setShowCategoryFilter(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-all whitespace-nowrap ${
                selectedRegion !== 'all'
                  ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{selectedRegion === 'all' ? '地域' : selectedRegion}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {showRegionFilter && (
              <div className="absolute top-full mt-1 left-0 bg-white border border-slate-200 rounded-lg shadow-lg z-40 min-w-[120px]">
                {regions.map((region) => (
                  <button
                    key={region}
                    onClick={() => {
                      setSelectedRegion(region);
                      setShowRegionFilter(false);
                    }}
                    className="block w-full px-4 py-2 text-xs text-left hover:bg-indigo-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {region === 'all' ? 'すべて' : region}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Distance Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowDistanceFilter(!showDistanceFilter);
                setShowRegionFilter(false);
                setShowMonthFilter(false);
                setShowCategoryFilter(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-all whitespace-nowrap ${
                selectedDistance !== 'all'
                  ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-200'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>
                {selectedDistance === 'all' ? '距離' : getDistanceLabel(selectedDistance)}
              </span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {showDistanceFilter && (
              <div className="absolute top-full mt-1 left-0 bg-white border border-slate-200 rounded-lg shadow-lg z-40 min-w-[140px]">
                {distances.map((distance) => (
                  <button
                    key={distance.value}
                    onClick={() => {
                      setSelectedDistance(distance.value);
                      setShowDistanceFilter(false);
                    }}
                    className="block w-full px-4 py-2 text-xs text-left hover:bg-indigo-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {distance.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Month Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowMonthFilter(!showMonthFilter);
                setShowRegionFilter(false);
                setShowDistanceFilter(false);
                setShowCategoryFilter(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-all whitespace-nowrap ${
                selectedMonth !== 'all'
                  ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{selectedMonth === 'all' ? '月' : selectedMonth}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {showMonthFilter && (
              <div className="absolute top-full mt-1 left-0 bg-white border border-slate-200 rounded-lg shadow-lg z-40 min-w-[100px]">
                {months.map((month) => (
                  <button
                    key={month}
                    onClick={() => {
                      setSelectedMonth(month);
                      setShowMonthFilter(false);
                    }}
                    className="block w-full px-4 py-2 text-xs text-left hover:bg-indigo-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {month === 'all' ? 'すべて' : month}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowCategoryFilter(!showCategoryFilter);
                setShowRegionFilter(false);
                setShowDistanceFilter(false);
                setShowMonthFilter(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-all whitespace-nowrap ${
                selectedCategory !== 'all'
                  ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-200'
              }`}
            >
              <span>{selectedCategory === 'all' ? 'カテゴリ' : selectedCategory}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {showCategoryFilter && (
              <div className="absolute top-full mt-1 left-0 bg-white border border-slate-200 rounded-lg shadow-lg z-40 min-w-[120px]">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowCategoryFilter(false);
                    }}
                    className="block w-full px-4 py-2 text-xs text-left hover:bg-indigo-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {category === 'all' ? 'すべて' : category}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pt-4 pb-32">
        {/* Race List */}
        <div className="space-y-2">
          {currentRaces.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-slate-400">該当する大会が見つかりません</p>
            </div>
          ) : (
            currentRaces.map((race) => {
              const selectedRace = selectedRaces.find((r) => r.id === race.id);
              const isSelected = !!selectedRace;
              const borderColor = isSelected ? getPriorityColor(selectedRace!.priority) : 'border-slate-200';

              return (
                <div
                  key={race.id}
                  className={`bg-white rounded-lg border-2 transition-all ${borderColor} ${
                    isSelected ? 'shadow-md' : 'hover:border-indigo-200'
                  }`}
                >
                  <div className="p-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-[13px] text-slate-800 leading-tight flex-1">{race.name}</h3>
                          {isSelected && (
                            <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${getPriorityBadgeColor(selectedRace!.priority)}`}>
                              {selectedRace!.priority}レース
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-600 mb-1">
                          <div className="flex items-center gap-0.5">
                            <Calendar className="w-2.5 h-2.5 flex-shrink-0" />
                            <span>{race.date}</span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                            <span>{race.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-100 text-indigo-700 rounded">
                            {getDistanceLabel(race.distance)}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${getStatusColor(
                              race.status
                            )}`}
                          >
                            {getStatusLabel(race.status)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleRaceSelection(race)}
                        className={`flex-shrink-0 px-3 py-1.5 text-[10px] font-bold rounded transition-all ${
                          isSelected ? 'bg-rose-500 text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected ? '削除' : '選択'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-6 mb-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border-y border-gray-300">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom spacing */}
      <div className="h-20"></div>

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-5 max-w-sm w-full mx-4">
            <div className="mb-4">
              <h3 className="font-bold text-base text-slate-800 mb-2">{confirmDialog.race.name}</h3>
              <p className="text-xs text-slate-600">このレースの優先度を選択してください</p>
            </div>
            
            <div className="space-y-2 mb-4">
              <button
                onClick={() => confirmRaceSelection('A')}
                className="w-full py-3 px-4 bg-[#FF33CC] hover:bg-[#FF33CC]/90 text-white rounded-lg font-bold text-sm transition-all"
              >
                Aレース（最優先）
              </button>
              <button
                onClick={() => confirmRaceSelection('B')}
                className="w-full py-3 px-4 bg-[#0066FF] hover:bg-[#0066FF]/90 text-white rounded-lg font-bold text-sm transition-all"
              >
                Bレース（重要）
              </button>
              <button
                onClick={() => confirmRaceSelection('C')}
                className="w-full py-3 px-4 bg-[#6666FF] hover:bg-[#6666FF]/90 text-white rounded-lg font-bold text-sm transition-all"
              >
                Cレース（調整レース）
              </button>
            </div>

            <button
              onClick={cancelRaceSelection}
              className="w-full py-2.5 bg-slate-100 text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-200 transition-all"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  );
}