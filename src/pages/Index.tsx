import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

type Vinyl = {
  id: number;
  title: string;
  artist: string;
  year: number;
  genre: string;
  condition: string;
  price: number;
  image: string;
};

type CartItem = Vinyl & { quantity: number };

const vinylData: Vinyl[] = [
  { id: 1, title: "Abbey Road", artist: "The Beatles", year: 1969, genre: "Rock", condition: "Mint", price: 2500, image: "🎵" },
  { id: 2, title: "Dark Side of the Moon", artist: "Pink Floyd", year: 1973, genre: "Progressive Rock", condition: "Near Mint", price: 3200, image: "🌙" },
  { id: 3, title: "Thriller", artist: "Michael Jackson", year: 1982, genre: "Pop", condition: "Very Good", price: 1800, image: "👻" },
  { id: 4, title: "Kind of Blue", artist: "Miles Davis", year: 1959, genre: "Jazz", condition: "Mint", price: 4500, image: "🎺" },
  { id: 5, title: "Rumours", artist: "Fleetwood Mac", year: 1977, genre: "Rock", condition: "Near Mint", price: 2100, image: "💿" },
  { id: 6, title: "The Velvet Underground & Nico", artist: "The Velvet Underground", year: 1967, genre: "Art Rock", condition: "Good", price: 3800, image: "🍌" },
  { id: 7, title: "What's Going On", artist: "Marvin Gaye", year: 1971, genre: "Soul", condition: "Very Good", price: 2800, image: "🎤" },
  { id: 8, title: "Led Zeppelin IV", artist: "Led Zeppelin", year: 1971, genre: "Hard Rock", condition: "Near Mint", price: 3500, image: "🎸" },
];

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'contacts'>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');

  const genres = ['all', ...Array.from(new Set(vinylData.map(v => v.genre)))];
  const years = ['all', ...Array.from(new Set(vinylData.map(v => v.year.toString()))).sort()];
  const conditions = ['all', ...Array.from(new Set(vinylData.map(v => v.condition)))];

  const filteredVinyls = vinylData.filter(vinyl => {
    const matchesSearch = vinyl.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         vinyl.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || vinyl.genre === selectedGenre;
    const matchesYear = selectedYear === 'all' || vinyl.year.toString() === selectedYear;
    const matchesCondition = selectedCondition === 'all' || vinyl.condition === selectedCondition;
    
    return matchesSearch && matchesGenre && matchesYear && matchesCondition;
  });

  const addToCart = (vinyl: Vinyl) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === vinyl.id);
      if (existing) {
        return prev.map(item => 
          item.id === vinyl.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...vinyl, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
    } else {
      setCart(prev => prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl animate-spin-slow">💿</div>
            <h1 className="text-3xl font-bold tracking-wider">VINYL VAULT</h1>
          </div>
          
          <nav className="hidden md:flex gap-6">
            <button 
              onClick={() => setCurrentPage('home')}
              className={`text-lg hover:text-secondary transition-colors ${currentPage === 'home' ? 'text-secondary font-bold' : ''}`}
            >
              Главная
            </button>
            <button 
              onClick={() => setCurrentPage('about')}
              className={`text-lg hover:text-secondary transition-colors ${currentPage === 'about' ? 'text-secondary font-bold' : ''}`}
            >
              О магазине
            </button>
            <button 
              onClick={() => setCurrentPage('contacts')}
              className={`text-lg hover:text-secondary transition-colors ${currentPage === 'contacts' ? 'text-secondary font-bold' : ''}`}
            >
              Контакты
            </button>
          </nav>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary" size="lg" className="relative">
                <Icon name="ShoppingCart" size={20} />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle className="text-2xl">Корзина</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {cart.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Корзина пуста</p>
                ) : (
                  <>
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-4 items-center p-4 bg-card rounded-lg">
                        <div className="text-4xl">{item.image}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.artist}</p>
                          <p className="text-primary font-bold mt-1">{item.price} ₽</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Icon name="Trash2" size={18} />
                        </Button>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between items-center text-xl font-bold pt-4">
                      <span>Итого:</span>
                      <span className="text-primary">{totalPrice} ₽</span>
                    </div>
                    <Button className="w-full" size="lg">
                      Оформить заказ
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {currentPage === 'home' && (
          <>
            <section className="mb-12 text-center animate-fade-in">
              <h2 className="text-5xl font-bold mb-4">Коллекция виниловых сокровищ</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Редкие пластинки с душой. Каждая запись — путешествие в прошлое, где звук был настоящим.
              </p>
            </section>

            <div className="mb-8 bg-card p-6 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Input 
                  placeholder="Поиск по названию или исполнителю..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="lg:col-span-2"
                />
                
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger>
                    <SelectValue placeholder="Жанр" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map(genre => (
                      <SelectItem key={genre} value={genre}>
                        {genre === 'all' ? 'Все жанры' : genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Год" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year}>
                        {year === 'all' ? 'Все годы' : year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                  <SelectTrigger>
                    <SelectValue placeholder="Состояние" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map(condition => (
                      <SelectItem key={condition} value={condition}>
                        {condition === 'all' ? 'Любое' : condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredVinyls.map((vinyl, index) => (
                <Card 
                  key={vinyl.id} 
                  className="hover:shadow-xl transition-shadow duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="pt-6">
                    <div className="text-7xl mb-4 text-center">{vinyl.image}</div>
                    <h3 className="text-xl font-bold mb-2">{vinyl.title}</h3>
                    <p className="text-muted-foreground mb-1">{vinyl.artist}</p>
                    <div className="flex gap-2 mb-3 flex-wrap">
                      <Badge variant="secondary">{vinyl.year}</Badge>
                      <Badge variant="outline">{vinyl.genre}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Состояние: <span className="font-semibold">{vinyl.condition}</span>
                    </p>
                    <p className="text-2xl font-bold text-primary">{vinyl.price} ₽</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={() => addToCart(vinyl)}
                    >
                      <Icon name="ShoppingCart" size={18} className="mr-2" />
                      В корзину
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {filteredVinyls.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">Ничего не найдено. Попробуйте изменить фильтры.</p>
              </div>
            )}
          </>
        )}

        {currentPage === 'about' && (
          <div className="max-w-3xl mx-auto animate-fade-in">
            <h2 className="text-4xl font-bold mb-6">О магазине Vinyl Vault</h2>
            <div className="prose prose-lg">
              <p className="text-lg mb-4">
                Добро пожаловать в Vinyl Vault — место, где живёт настоящая музыка. Мы коллекционируем и продаём 
                виниловые пластинки с 2010 года, собирая редкие экземпляры со всего мира.
              </p>
              <p className="text-lg mb-4">
                Каждая пластинка в нашей коллекции проходит тщательную проверку качества. Мы оцениваем состояние 
                винила, обложки и звучания, чтобы вы получили именно то, что ожидаете.
              </p>
              <p className="text-lg mb-6">
                Винил — это не просто носитель музыки, это целая культура. Тёплый аналоговый звук, большие обложки 
                с артом, ритуал проигрывания — всё это делает прослушивание музыки особенным событием.
              </p>
              <div className="bg-card p-6 rounded-lg mt-8">
                <h3 className="text-2xl font-bold mb-4">Наши преимущества</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-primary mt-1" size={20} />
                    <span>Все пластинки проверены и описаны честно</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-primary mt-1" size={20} />
                    <span>Редкие и коллекционные издания</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-primary mt-1" size={20} />
                    <span>Быстрая доставка по всей России</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-primary mt-1" size={20} />
                    <span>Консультации по выбору проигрывателя</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'contacts' && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <h2 className="text-4xl font-bold mb-6">Контакты</h2>
            <div className="bg-card p-8 rounded-lg space-y-6">
              <div className="flex items-start gap-4">
                <Icon name="MapPin" className="text-primary mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-lg mb-1">Адрес</h3>
                  <p className="text-muted-foreground">г. Москва, ул. Винтажная, д. 42</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-4">
                <Icon name="Phone" className="text-primary mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-lg mb-1">Телефон</h3>
                  <p className="text-muted-foreground">+7 (495) 123-45-67</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-4">
                <Icon name="Mail" className="text-primary mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-lg mb-1">Email</h3>
                  <p className="text-muted-foreground">info@vinylvault.ru</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-4">
                <Icon name="Clock" className="text-primary mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-lg mb-1">Часы работы</h3>
                  <p className="text-muted-foreground">Пн-Пт: 10:00 - 20:00</p>
                  <p className="text-muted-foreground">Сб-Вс: 11:00 - 18:00</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-primary text-primary-foreground mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="text-3xl">💿</div>
            <p className="text-xl font-bold">VINYL VAULT</p>
          </div>
          <p className="text-secondary">© 2026 Vinyl Vault. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
