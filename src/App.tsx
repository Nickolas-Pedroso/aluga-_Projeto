import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { api } from './api'
import {
  ArrowRight, Box, Check, ChevronDown, CircleUserRound, CreditCard, Filter, Heart,
  LayoutDashboard, LogOut, Menu, Package, Pencil, Plus, Search, Settings2, ShoppingBag,
  ShoppingCart, Sparkles, Trash2, Truck, Upload, Users, X
} from 'lucide-react'

type Product = { id: number; name: string; brand: string; model: string; category: string; price: number; stock: number; image: string; tone: string; tag?: string }
type CartItem = Product & { quantity: number }
type Client = { id: number; name: string; email: string; phone: string; cpf: string; address: string; rentals: number; password?: string; role?: 'admin' | 'customer' }
type Order = { id: string; client: string; product: string; total: number; status: string; date: string }
type RegistrationDraft = { name: string; email: string; phone: string; cpf: string; address: string; password: string; role: 'customer' }

type View = 'catalog' | 'products' | 'clients' | 'orders'
type InfoPage = 'how' | 'support' | null

const initialProducts: Product[] = [
  { id: 1, name: 'Câmera Sony A7 IV', brand: 'Sony', model: 'A7 IV', category: 'Fotografia', price: 189, stock: 4, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&h=675&q=85', tone: 'rose', tag: 'Mais pedido' },
  { id: 2, name: 'MacBook Pro 14” M3', brand: 'Apple', model: 'MacBook Pro 14 M3', category: 'Tecnologia', price: 249, stock: 7, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&h=675&q=85', tone: 'blue', tag: 'Novo' },
  { id: 3, name: 'Kit Luz Profissional', brand: 'Godox', model: 'SL-60W Kit', category: 'Estúdio', price: 95, stock: 12, image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&h=675&q=85', tone: 'amber' },
  { id: 4, name: 'Projetor Epson 4K', brand: 'Epson', model: 'Home Cinema 4K', category: 'Eventos', price: 129, stock: 3, image: 'https://images.unsplash.com/photo-1626379953822-baec19c3accd?auto=format&fit=crop&w=900&h=675&q=85', tone: 'violet' },
  { id: 5, name: 'DJI Osmo Pocket 3', brand: 'DJI', model: 'Osmo Pocket 3', category: 'Vídeo', price: 149, stock: 6, image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&h=675&q=85', tone: 'green' },
  { id: 6, name: 'Console PlayStation 5', brand: 'Sony', model: 'PlayStation 5', category: 'Games', price: 119, stock: 2, image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=900&h=675&q=85', tone: 'cyan' },
  { id: 7, name: 'Microfone Shure SM7B', brand: 'Shure', model: 'SM7B', category: 'Áudio', price: 79, stock: 8, image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=900&h=675&q=85', tone: 'slate', tag: 'Para podcasts' },
  { id: 8, name: 'GoPro HERO12 Black', brand: 'GoPro', model: 'HERO12 Black', category: 'Vídeo', price: 89, stock: 5, image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&h=675&q=85', tone: 'orange' },
  { id: 9, name: 'Lente Sony 24-70mm', brand: 'Sony', model: 'FE 24-70mm GM II', category: 'Fotografia', price: 139, stock: 3, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&h=675&q=85', tone: 'gold' },
  { id: 10, name: 'Tripé Manfrotto', brand: 'Manfrotto', model: 'Befree Advanced', category: 'Fotografia', price: 45, stock: 10, image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&h=675&q=85', tone: 'olive' },
  { id: 11, name: 'Mesa de Som Yamaha', brand: 'Yamaha', model: 'MG10XU', category: 'Áudio', price: 99, stock: 4, image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=900&h=675&q=85', tone: 'navy' },
  { id: 12, name: 'Ring Light LED 18”', brand: 'Greika', model: 'RL-18', category: 'Estúdio', price: 39, stock: 15, image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&h=675&q=85', tone: 'peach' },
]

const initialClients: Client[] = [
  { id: 1, name: 'Nickolas Pedroso', email: 'nickolas.pedroso@email.com', phone: '(11) 98888-2211', cpf: '123.456.789-00', address: 'Rua das Flores, 120 - São Paulo', rentals: 8, password: 'admin123', role: 'admin' },
  { id: 2, name: 'Rafael Nunes', email: 'rafael@email.com', phone: '(21) 97777-4422', cpf: '987.654.321-00', address: 'Av. Atlântica, 450 - Rio de Janeiro', rentals: 3 },
]

const initialOrders: Order[] = [
  { id: 'ALU-1024', client: 'Marina Costa', product: 'Câmera Sony A7 IV', total: 567, status: 'Em andamento', date: 'Hoje, 09:42' },
  { id: 'ALU-1023', client: 'Rafael Nunes', product: 'MacBook Pro 14” M3', total: 996, status: 'Aguardando pagamento', date: 'Ontem, 18:20' },
]

const money = (value: number) => `R$ ${value.toLocaleString('pt-BR')}`
const digitsOnly = (value: string) => value.replace(/\D/g, '')
const formatCpf = (value: string) => {
  const digits = digitsOnly(value).slice(0, 11)
  return digits.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}
const formatPhone = (value: string) => {
  const digits = digitsOnly(value).slice(0, 11)
  if (digits.length <= 2) return digits.length ? `(${digits}` : ''
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.length === 11 ? digits.slice(2, 7) : digits.slice(2, 6)}-${digits.length === 11 ? digits.slice(7) : digits.slice(6)}`
}
const fileSlug = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function App() {
  const [view, setView] = useState<View>('catalog')
  const [products, setProducts] = useState(initialProducts)
  const [clients, setClients] = useState(initialClients)
  const [orders, setOrders] = useState(initialOrders)
  const [cart, setCart] = useState<CartItem[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todos')
  const [maxPrice, setMaxPrice] = useState('')
  const [showCart, setShowCart] = useState(false)
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>()
  const [showClientForm, setShowClientForm] = useState(false)
  const [showCustomerArea, setShowCustomerArea] = useState(false)
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(() => window.localStorage.getItem('alugae-authenticated') === 'true')
  const [isAdmin, setIsAdmin] = useState(() => window.localStorage.getItem('alugae-role') === 'admin' || window.localStorage.getItem('alugae-authenticated') === 'true')
  const [currentUserEmail, setCurrentUserEmail] = useState(() => window.localStorage.getItem('alugae-user-email') || '')
  const [infoPage, setInfoPage] = useState<InfoPage>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    async function loadStorageData() {
      try {
        let [remoteProducts, remoteClients, remoteOrders] = await Promise.all([api.products.list(), api.clients.list(), api.orders.list()]) as [Product[], Client[], Order[]]
        if (!remoteProducts.length) await Promise.all(initialProducts.map((product) => api.products.create(product)))
        if (!remoteClients.length) await Promise.all(initialClients.map((client) => api.clients.create(client)))
        if (!remoteOrders.length) await Promise.all(initialOrders.map((order) => api.orders.create(order)))
        if (!remoteProducts.length || !remoteClients.length || !remoteOrders.length) [remoteProducts, remoteClients, remoteOrders] = await Promise.all([api.products.list(), api.clients.list(), api.orders.list()]) as [Product[], Client[], Order[]]
        const blobProducts = await Promise.all(remoteProducts.map(async (product) => {
          if (!product.image.startsWith('https://images.unsplash.com')) return product
          try {
            const uploaded = await api.uploads.remote(product.image, `produto-${product.id}.jpg`) as { url: string }
            await api.products.update(product.id, { image: uploaded.url })
            return { ...product, image: uploaded.url }
          } catch {
            return product
          }
        }))
        setProducts(blobProducts)
        setClients(remoteClients)
        setOrders(remoteOrders)
      } catch {
        return
      }
    }
    loadStorageData()
  }, [])

  const categories = ['Todos', ...Array.from(new Set(products.map((product) => product.category)))]
  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesSearch = `${product.name} ${product.brand} ${product.model} ${product.category}`.toLowerCase().includes(search.toLowerCase())
    const matchesPrice = !maxPrice || product.price <= Number(maxPrice)
    return matchesSearch && matchesPrice && (category === 'Todos' || product.category === category)
  }), [products, search, category, maxPrice])
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const currentUser = clients.find((client) => client.email === currentUserEmail) || (isAdmin ? clients.find((client) => client.role === 'admin') || clients[0] : undefined)

  function addToCart(product: Product) {
    setCart((current) => {
      const found = current.find((item) => item.id === product.id)
      if (found) return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      return [...current, { ...product, quantity: 1 }]
    })
    setNotice(`${product.name} adicionado à reserva`)
    window.setTimeout(() => setNotice(''), 2600)
  }

  function updateQuantity(id: number, delta: number) {
    setCart((current) => current.flatMap((item) => item.id !== id ? item : item.quantity + delta > 0 ? [{ ...item, quantity: item.quantity + delta }] : []))
  }

  async function removeProduct(id: number) {
    setProducts((current) => current.filter((product) => product.id !== id))
    try { await api.products.remove(id) } catch { setNotice('Produto removido apenas nesta sessão') }
  }

  async function removeClient(id: number) {
    setClients((current) => current.filter((client) => client.id !== id))
    try { await api.clients.remove(id) } catch { setNotice('Cliente removido apenas nesta sessão') }
  }

  async function saveProduct(product: Omit<Product, 'id'>) {
    const saved = editingProduct ? await api.products.update(editingProduct.id, product) : await api.products.create(product)
    const nextProduct = { ...product, id: editingProduct?.id || (saved as Product).id || Date.now() }
    setProducts((current) => editingProduct ? current.map((item) => item.id === editingProduct.id ? nextProduct : item) : [...current, nextProduct])
    setShowProductForm(false)
    setEditingProduct(undefined)
    setNotice(editingProduct ? 'Produto atualizado com sucesso' : 'Produto cadastrado no Azure')
  }

  async function saveClient(draft: ClientDraft, existing?: Client) {
    const saved = existing ? await api.clients.update(existing.id, draft) : await api.clients.create(draft)
    const nextClient = { ...draft, id: existing?.id || (saved as Client).id || Date.now(), rentals: existing?.rentals || 0, role: existing?.role || 'customer' as const }
    setClients((current) => existing ? current.map((item) => item.id === existing.id ? nextClient : item) : [...current, nextClient])
    setShowClientForm(false)
    setNotice(existing ? 'Cliente atualizado no Azure' : 'Cliente cadastrado no Azure')
    return nextClient
  }

  async function finishCheckout(data: { name: string; email: string; delivery: string; address: string; payment: string }) {
    try {
      await api.orders.create({ client: data.name, email: data.email, delivery: data.delivery, address: data.address, payment: data.payment, items: cart.map(({ id, name: product, quantity, price }) => ({ id, product, quantity, price })), total: cartTotal })
      setOrders((current) => [{ id: `ALU-${Date.now()}`, client: data.name, product: cart[0]?.name || 'Reserva', total: cartTotal, status: 'Aguardando confirmação', date: 'Agora' }, ...current])
      setCart([])
      setShowCheckout(false)
      setNotice('Pedido salvo no Azure com sucesso')
    } catch {
      setNotice('Pedido concluído localmente; verifique se a API está ligada')
      setCart([])
      setShowCheckout(false)
    }
  }

  return <div className={isLoggedIn ? 'app-shell' : 'app-shell logged-out'}>
    <header className="topbar">
      <button className="mobile-menu icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu"><Menu size={20} /></button>
      <button className="brand" onClick={() => { setView('catalog'); setInfoPage(null) }}><span className="brand-mark">aê</span><span>aluga<span className="brand-accent">ê</span></span></button>
      <nav className={menuOpen ? 'main-nav open' : 'main-nav'}>
        <button className={view === 'catalog' && !infoPage ? 'nav-link active' : 'nav-link'} onClick={() => { setView('catalog'); setInfoPage(null); setMenuOpen(false) }}>Explorar</button>
        <button className={infoPage === 'how' ? 'nav-link active' : 'nav-link'} onClick={() => { setView('catalog'); setInfoPage('how'); setMenuOpen(false) }}>Como funciona</button>
        <button className={infoPage === 'support' ? 'nav-link active' : 'nav-link'} onClick={() => { setView('catalog'); setInfoPage('support'); setMenuOpen(false) }}>Suporte</button>
      </nav>
      <div className="top-actions">
        <button className="icon-button" aria-label="Buscar" onClick={() => document.getElementById('search')?.focus()}><Search size={19} /></button>
        <button className="icon-button cart-button" aria-label="Abrir reserva" onClick={() => setShowCart(true)}><ShoppingBag size={19} />{cartCount > 0 && <span>{cartCount}</span>}</button>
        <button className="avatar-button" aria-label={isLoggedIn ? 'Abrir menu da conta' : 'Abrir login'} onClick={() => isLoggedIn ? setShowAccountMenu((current) => !current) : setShowLogin(true)}><CircleUserRound size={22} /></button>
      </div>
    </header>

    {isLoggedIn && showAccountMenu && <AccountMenu client={currentUser} onDetails={() => { setShowAccountMenu(false); setShowCustomerArea(true) }} onLogout={() => { window.localStorage.removeItem('alugae-authenticated'); window.localStorage.removeItem('alugae-role'); window.localStorage.removeItem('alugae-user-email'); setIsLoggedIn(false); setIsAdmin(false); setShowAccountMenu(false); setNotice('') }} onDelete={() => { window.localStorage.removeItem('alugae-authenticated'); window.localStorage.removeItem('alugae-role'); window.localStorage.removeItem('alugae-user-email'); setIsLoggedIn(false); setIsAdmin(false); setShowAccountMenu(false); setClients((current) => current.filter((client) => client.id !== currentUser?.id)); setNotice('') }} />}
    {!isLoggedIn && <button className="login-quick-button" onClick={() => setShowLogin(true)}>Entrar</button>}

    {view === 'catalog' && !infoPage && <main>
      <section className="hero">
        <div className="hero-copy"><p className="eyebrow"><Sparkles size={15} /> Seu próximo projeto começa aqui</p><h1>Alugue o que<br /><em>faz acontecer.</em></h1><p className="hero-text">Equipamentos incríveis, de pessoas reais.<br />Por dias, semanas ou pelo tempo que precisar.</p><button className="primary-button" onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}>Explorar equipamentos <ArrowRight size={17} /></button></div>
        <div className="hero-visual"><div className="hero-photo"><img src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1100&h=850&q=85" alt="Câmera profissional em uma mesa" fetchPriority="high" /></div><div className="hero-note"><span className="note-dot"></span><strong>+ 2.400</strong><small>equipamentos disponíveis</small></div><div className="hero-stamp">feito para<br /><strong>criar</strong></div></div>
      </section>
      <section className="stats-row"><div><strong>4.9</strong><span>avaliação média</span></div><div><strong>24h</strong><span>aluguel mais rápido</span></div><div><strong>100%</strong><span>compra protegida</span></div><div className="stats-slogan">Alugue melhor.<br /><em>Viva mais.</em></div></section>
      <section className="catalog-section" id="catalog">
        <div className="section-heading"><div><p className="eyebrow">Curadoria da semana</p><h2>Encontre seu próximo <em>favorito.</em></h2></div><button className="text-button" onClick={() => setCategory('Todos')}>Ver tudo <ArrowRight size={16} /></button></div>
        <div className="filters"><div className="search-field"><Search size={18} /><input id="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por marca, modelo ou categoria..." /></div><div className="category-list">{categories.map((item) => <button key={item} className={category === item ? 'category active' : 'category'} onClick={() => setCategory(item)}>{item}</button>)}</div><label className="price-filter">Até <input type="number" min="0" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="R$ / dia" /></label><button className="filter-button" onClick={() => { setSearch(''); setCategory('Todos'); setMaxPrice('') }}><Filter size={16} /> Limpar <ChevronDown size={14} /></button></div>
        <div className="product-grid">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} />)}</div>
      </section>
      <section className="trust-band"><div className="trust-icon"><Truck size={25} /></div><div><strong>Do nosso espaço para o seu.</strong><span>Entrega e retirada combinadas com quem entende do assunto.</span></div><button className="text-button" onClick={() => setNotice('Nossa política de entrega está sendo preparada')}>Saiba mais <ArrowRight size={16} /></button></section>
    </main>}

    {view === 'catalog' && infoPage && <InfoPageView page={infoPage} onExplore={() => setInfoPage(null)} onRegister={() => setShowRegister(true)} />}

    {view !== 'catalog' && <AdminView view={view} products={products} clients={clients} orders={orders} onAdd={() => { setEditingProduct(undefined); setShowProductForm(true) }} onEdit={(product) => { setEditingProduct(product); setShowProductForm(true) }} onAddClient={() => setShowClientForm(true)} onUpdateClient={(client) => saveClient(client, client)} onRemove={removeProduct} onRemoveClient={removeClient} onBack={() => setView('catalog')} />}

    <footer className="footer"><div className="brand footer-brand"><span className="brand-mark">aê</span><span>aluga<span className="brand-accent">ê</span></span></div><p>Equipamento certo. Ideia grande.</p><span>© 2025 Alugaê</span></footer>

    {isLoggedIn && isAdmin && <div className="admin-dock"><span>Área de gestão</span><button className={view === 'products' ? 'dock-active' : ''} onClick={() => setView('products')}><Package size={16} />Produtos</button><button className={view === 'clients' ? 'dock-active' : ''} onClick={() => setView('clients')}><Users size={16} />Clientes</button><button className={view === 'orders' ? 'dock-active' : ''} onClick={() => setView('orders')}><LayoutDashboard size={16} />Pedidos</button></div>}

    {notice && <div className="toast"><Check size={17} />{notice}</div>}
    {showCart && <aside className="drawer-backdrop" onClick={() => setShowCart(false)}><div className="cart-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-header"><div><p className="eyebrow">Sua seleção</p><h2>Minha reserva <span>{cartCount}</span></h2></div><button className="icon-button" onClick={() => setShowCart(false)}><X size={20} /></button></div>{cart.length === 0 ? <div className="empty-cart"><ShoppingBag size={34} /><p>Sua reserva está vazia.</p><span>Escolha algo especial para começar.</span></div> : <><div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}><img src={item.image} alt="" /><div><strong>{item.name}</strong><span>{money(item.price)} / dia</span><div className="quantity"><button onClick={() => updateQuantity(item.id, -1)}>-</button><b>{item.quantity}</b><button onClick={() => updateQuantity(item.id, 1)}>+</button></div></div></div>)}</div><div className="cart-total"><span>Total estimado</span><strong>{money(cartTotal)} <small>/ dia</small></strong></div><button className="primary-button full" onClick={() => { setShowCart(false); setShowCheckout(true) }}>Continuar para checkout <ArrowRight size={17} /></button></>}</div></aside>}
    {showCheckout && <CheckoutValidated client={isLoggedIn ? currentUser : undefined} total={cartTotal} cart={cart} onClose={() => setShowCheckout(false)} onDone={finishCheckout} />}
    {showProductForm && <ProductForm initial={editingProduct} onClose={() => { setShowProductForm(false); setEditingProduct(undefined) }} onSave={saveProduct} />}
    {showClientForm && <ClientForm onClose={() => setShowClientForm(false)} onSave={(client) => saveClient(client)} />}
    {showCustomerArea && currentUser && <CustomerArea client={currentUser} orders={orders} onClose={() => setShowCustomerArea(false)} onRegister={() => { setShowCustomerArea(false); setShowRegister(true) }} onLogout={() => { window.localStorage.removeItem('alugae-authenticated'); window.localStorage.removeItem('alugae-role'); window.localStorage.removeItem('alugae-user-email'); setIsLoggedIn(false); setIsAdmin(false); setShowCustomerArea(false); setNotice('Você saiu da sua conta') }} onSave={(client) => saveClient(client, client)} />}
    {showRegister && <RegisterForm onClose={() => setShowRegister(false)} onDone={async (draft) => { const created = await saveClient(draft); window.localStorage.setItem('alugae-authenticated', 'true'); window.localStorage.setItem('alugae-role', 'customer'); window.localStorage.setItem('alugae-user-email', created.email); setCurrentUserEmail(created.email); setIsLoggedIn(true); setIsAdmin(false); setShowRegister(false); setNotice(`Cadastro de ${draft.name} criado como usuário`) }} />}
    {showLogin && <LoginForm clients={clients} onClose={() => setShowLogin(false)} onRegister={() => { setShowLogin(false); setShowRegister(true) }} onSuccess={(client) => { window.localStorage.setItem('alugae-authenticated', 'true'); window.localStorage.setItem('alugae-role', client.role || 'customer'); window.localStorage.setItem('alugae-user-email', client.email); setCurrentUserEmail(client.email); setIsLoggedIn(true); setIsAdmin(client.role === 'admin'); setShowLogin(false); setNotice(client.role === 'admin' ? 'Login de administrador realizado' : 'Login realizado com sucesso') }} />}
  </div>
}

function AccountMenu({ client, onDetails, onLogout, onDelete }: { client?: Client; onDetails: () => void; onLogout: () => void; onDelete: () => void }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const initials = client?.name.split(' ').map((part) => part[0]).slice(0, 2).join('') || 'NP'
  return <div className="account-menu"><div className="account-menu-head"><div className="profile-avatar">{initials}</div><div><strong>{client?.name || 'Usuário'}</strong><span>{client?.email || 'Sem e-mail'}</span></div></div><button onClick={onDetails}><CircleUserRound size={16} /> Detalhes da conta</button><button onClick={onLogout}><LogOut size={16} /> Sair da conta</button>{confirmDelete ? <div className="delete-confirm"><span>Excluir seus dados e histórico?</span><button onClick={onDelete}>Confirmar exclusão</button></div> : <button className="danger-action" onClick={() => setConfirmDelete(true)}><Trash2 size={16} /> Excluir conta</button>}</div>
}

function InfoPageView({ page, onExplore, onRegister }: { page: Exclude<InfoPage, null>; onExplore: () => void; onRegister: () => void }) {
  if (page === 'how') return <main className="info-page"><div className="info-hero"><p className="eyebrow"><Sparkles size={15} /> Simples do começo ao fim</p><h1>Alugue sem<br /><em>complicar.</em></h1><p>Você escolhe, reserva e recebe. O equipamento certo fica com você pelo tempo que o seu projeto precisar.</p><button className="primary-button" onClick={onExplore}>Explorar equipamentos <ArrowRight size={17} /></button></div><div className="steps-grid"><div><span>01</span><Package size={23} /><h2>Escolha</h2><p>Encontre câmeras, tecnologia, luzes e muito mais na nossa curadoria.</p></div><div><span>02</span><ShoppingBag size={23} /><h2>Reserve</h2><p>Defina o período, a entrega e o pagamento sem burocracia.</p></div><div><span>03</span><Truck size={23} /><h2>Receba</h2><p>Combinamos tudo com você e acompanhamos a locação até a devolução.</p></div></div><section className="info-callout"><div><p className="eyebrow">Feito para criar</p><h2>Seu projeto merece<br /><em>mais possibilidades.</em></h2></div><button className="text-button" onClick={onRegister}>Criar minha conta <ArrowRight size={16} /></button></section></main>
  return <main className="info-page support-page"><div className="info-hero"><p className="eyebrow"><Heart size={15} /> Estamos por perto</p><h1>Como podemos<br /><em>ajudar?</em></h1><p>Conte com a gente para escolher o equipamento, organizar sua entrega ou resolver qualquer dúvida sobre a sua reserva.</p><div className="support-search"><Search size={18} /><input placeholder="Busque uma dúvida..." /></div></div><div className="support-grid"><button onClick={() => alert('Fale com a equipe pelo e-mail suporte@alugae.com.br')}><CreditCard size={22} /><strong>Pagamento e segurança</strong><span>Formas de pagamento, caução e proteção.</span><ArrowRight size={16} /></button><button onClick={() => alert('Fale com a equipe pelo e-mail suporte@alugae.com.br')}><Truck size={22} /><strong>Entrega e devolução</strong><span>Prazos, retirada e como devolver.</span><ArrowRight size={16} /></button><button onClick={() => alert('Fale com a equipe pelo e-mail suporte@alugae.com.br')}><Users size={22} /><strong>Falar com a equipe</strong><span>Respondemos em até um dia útil.</span><ArrowRight size={16} /></button></div><div className="support-contact"><div><span className="note-dot"></span><strong>Suporte humano, de verdade.</strong><p>Envie um e-mail para suporte@alugae.com.br</p></div><button className="primary-button" onClick={() => window.location.href = 'mailto:suporte@alugae.com.br'}>Enviar e-mail <ArrowRight size={17} /></button></div></main>
}

function LoginForm({ clients, onClose, onRegister, onSuccess }: { clients: Client[]; onClose: () => void; onRegister: () => void; onSuccess: (client: Client) => void }) {
  const [email, setEmail] = useState('nickolas.pedroso@email.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  function submit() {
    const client = clients.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password)
    if (client) return onSuccess(client)
    setError('E-mail ou senha inválidos.')
  }
  return <div className="modal-backdrop"><div className="checkout-modal login-modal"><button className="modal-close icon-button" onClick={onClose}><X size={20} /></button><p className="eyebrow">Acessar conta</p><h2>Bem-vindo de volta.</h2><p className="modal-intro">Entre para acompanhar seus pedidos, editar seus dados e continuar suas reservas.</p><div className="form-grid"><label className="span-two">E-mail<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@email.com" /></label><label className="span-two">Senha<input type="password" value={password} onChange={(event) => { setPassword(event.target.value); setError('') }} placeholder="Digite sua senha" /></label>{error && <p className="form-error span-two">{error}</p>}<button className="primary-button span-two" disabled={!email || !password} onClick={submit}>Entrar <ArrowRight size={17} /></button><button className="text-button span-two login-register-link" onClick={onRegister}>Ainda não tenho cadastro <ArrowRight size={16} /></button></div></div></div>
}

function RegisterForm({ onClose, onDone }: { onClose: () => void; onDone: (draft: RegistrationDraft) => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [cpf, setCpf] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const valid = name.trim().length > 2 && email.includes('@') && digitsOnly(phone).length >= 10 && digitsOnly(cpf).length === 11 && address.trim().length > 5 && password.length >= 6
  return <div className="modal-backdrop"><div className="checkout-modal register-modal"><button className="modal-close icon-button" onClick={onClose}><X size={20} /></button><p className="eyebrow">Nova conta</p><h2>Crie seu acesso.</h2><p className="modal-intro">Você será cadastrado como usuário cliente, sem acesso ao painel administrativo.</p><div className="form-grid"><label className="span-two">Nome completo<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nome e sobrenome" /></label><label>E-mail<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@email.com" /></label><label>Telefone<input value={phone} onChange={(event) => setPhone(formatPhone(event.target.value))} inputMode="numeric" maxLength={15} placeholder="(00) 00000-0000" /></label><label>CPF<input value={cpf} onChange={(event) => setCpf(formatCpf(event.target.value))} inputMode="numeric" maxLength={14} placeholder="000.000.000-00" /></label><label>Endereço<input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Rua, número e cidade" /></label><label className="span-two">Senha<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} placeholder="Mínimo de 6 caracteres" /></label><button className="primary-button span-two" disabled={!valid} onClick={() => onDone({ name, email, phone, cpf, address, password, role: 'customer' })}>Criar conta cliente <Check size={17} /></button></div></div></div>
}

function PixPayment({ copied, onCopy }: { copied: boolean; onCopy: () => void }) {
  return <div className="pix-payment span-two"><div><strong>Pagamento via PIX</strong><span>Copie a chave abaixo e confirme o pedido depois do pagamento.</span></div><div className="pix-key"><code>nickolas@alugae.com.br</code><button type="button" onClick={onCopy}>{copied ? 'Copiada' : 'Copiar chave'}</button></div></div>
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: (product: Product) => void }) {
  const [favorite, setFavorite] = useState(false)
  const fallbackImage = 'https://placehold.co/900x675/e7e5df/152033?text=Imagem+indisponivel'
  return <article className="product-card"><div className={`product-image ${product.tone}`}><img src={product.image} alt={product.name} loading="lazy" decoding="async" onError={(event) => { if (event.currentTarget.src !== fallbackImage) event.currentTarget.src = fallbackImage }} />{product.tag && <span className="product-tag">{product.tag}</span>}<button className={favorite ? 'heart-button active' : 'heart-button'} aria-label={favorite ? `Remover ${product.name} dos favoritos` : `Favoritar ${product.name}`} aria-pressed={favorite} onClick={() => setFavorite((current) => !current)}><Heart size={17} fill={favorite ? 'currentColor' : 'none'} /></button></div><div className="product-info"><div><span className="product-category">{product.category}</span><h3>{product.name}</h3></div><div className="product-bottom"><div><strong>{money(product.price)}</strong><span>/ dia</span></div><button className="add-button" onClick={() => onAdd(product)}><Plus size={18} /></button></div></div></article>
}

function AdminView({ view, products, clients, orders, onAdd, onEdit, onAddClient, onUpdateClient, onRemove, onRemoveClient, onBack }: { view: View; products: Product[]; clients: Client[]; orders: Order[]; onAdd: () => void; onEdit: (product: Product) => void; onAddClient: () => void; onUpdateClient: (client: Client) => void; onRemove: (id: number) => void; onRemoveClient: (id: number) => void; onBack: () => void }) {
  const labels = { products: ['Produtos', 'Controle seu inventário e disponibilidade.'], clients: ['Clientes', 'Acompanhe sua comunidade de locatários.'], orders: ['Pedidos', 'Tudo que está acontecendo agora.'] }
  const [title, subtitle] = labels[view as 'products' | 'clients' | 'orders']
  if (view === 'clients') return <ClientAdmin clients={clients} onAdd={onAddClient} onUpdate={onUpdateClient} onRemove={onRemoveClient} onBack={onBack} />
  if (view === 'orders') return <OrderAdmin orders={orders} onBack={onBack} />
  return <main className="admin-page"><div className="admin-header"><div><button className="back-link" onClick={onBack}>← Voltar ao catálogo</button><p className="eyebrow">Painel de controle</p><h1>{title}</h1><p>{subtitle}</p></div>{view === 'products' && <button className="primary-button" onClick={onAdd}><Plus size={17} /> Novo produto</button>}</div><div className="dashboard-cards"><div><span>Ativos</span><strong>{view === 'products' ? products.length : view === 'clients' ? '128' : '24'}</strong><small className="positive">+ 12% este mês</small></div><div><span>Em andamento</span><strong>{view === 'orders' ? '08' : view === 'products' ? '32' : '16'}</strong><small>atualizado agora</small></div><div><span>Receita estimada</span><strong>R$ 18.420</strong><small className="positive">+ 8,4% este mês</small></div></div>{view === 'products' ? <div className="data-panel"><div className="panel-head"><h2>Inventário</h2><button className="filter-button"><Filter size={16} /> Filtrar</button></div><div className="table-wrap"><table><thead><tr><th>Produto</th><th>Categoria</th><th>Valor / dia</th><th>Estoque</th><th></th></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td><div className="table-product"><img src={product.image} alt="" /><strong>{product.name}</strong></div></td><td>{product.category}</td><td>{money(product.price)}</td><td><span className={product.stock < 4 ? 'stock low' : 'stock'}>{product.stock} un.</span></td><td><div className="row-actions"><button aria-label="Editar" onClick={() => onEdit(product)}><Pencil size={16} /></button><button aria-label="Excluir" onClick={() => onRemove(product.id)}><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div></div> : <div className="data-panel placeholder-panel"><Users size={32} /><h2>{view === 'clients' ? 'Seus clientes em um só lugar' : 'Pedidos recentes'}</h2><p>Esta área está conectada ao Azure Table Storage e pronta para receber os dados reais.</p><button className="text-button" onClick={onBack}>Voltar ao catálogo <ArrowRight size={16} /></button></div>}</main>
}

function ClientAdmin({ clients, onAdd, onUpdate, onRemove, onBack }: { clients: Client[]; onAdd: () => void; onUpdate: (client: Client) => void; onRemove: (id: number) => void; onBack: () => void }) {
  const [editing, setEditing] = useState<Client | null>(null)
  const [tab, setTab] = useState<'all' | 'customers' | 'admins'>('all')
  const admins = clients.filter((client) => client.role === 'admin')
  const customers = clients.filter((client) => client.role !== 'admin')
  const visibleClients = tab === 'admins' ? admins : tab === 'customers' ? customers : clients
  return <main className="admin-page"><div className="admin-header"><div><button className="back-link" onClick={onBack}>← Voltar ao catálogo</button><p className="eyebrow">Painel de controle</p><h1>Clientes e acessos</h1><p>Gerencie usuários, administradores e permissões da plataforma.</p></div><button className="primary-button" onClick={onAdd}><Plus size={17} /> Novo cliente</button></div><div className="dashboard-cards"><div><span>Total de contas</span><strong>{clients.length}</strong><small className="positive">base ativa</small></div><div><span>Usuários</span><strong>{customers.length}</strong><small>clientes da plataforma</small></div><div><span>Administradores</span><strong>{admins.length}</strong><small className="positive">acesso à gestão</small></div></div><div className="data-panel"><div className="access-tabs"><button className={tab === 'all' ? 'access-tab active' : 'access-tab'} onClick={() => setTab('all')}>Todos <b>{clients.length}</b></button><button className={tab === 'customers' ? 'access-tab active' : 'access-tab'} onClick={() => setTab('customers')}>Usuários <b>{customers.length}</b></button><button className={tab === 'admins' ? 'access-tab active' : 'access-tab'} onClick={() => setTab('admins')}>Administradores <b>{admins.length}</b></button></div><div className="panel-head"><h2>{tab === 'admins' ? 'Administradores' : tab === 'customers' ? 'Usuários' : 'Todas as contas'}</h2><button className="filter-button"><Filter size={16} /> Filtrar</button></div><div className="table-wrap"><table><thead><tr><th>Cliente</th><th>Contato</th><th>Perfil</th><th>Locações</th><th>Endereço</th><th></th></tr></thead><tbody>{visibleClients.map((client) => <tr key={client.id}><td><div className="table-product"><div className="client-avatar">{client.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><strong>{client.name}</strong></div></td><td><span>{client.email}</span><small className="table-subtitle">{client.phone}</small></td><td><select className={client.role === 'admin' ? 'role-select role-admin' : 'role-select'} value={client.role || 'customer'} onChange={(event) => onUpdate({ ...client, role: event.target.value as Client['role'] })}><option value="customer">Usuário</option><option value="admin">Administrador</option></select></td><td><span className="stock">{client.rentals} locações</span></td><td>{client.address}</td><td><div className="row-actions"><button aria-label="Editar cliente" onClick={() => setEditing(client)}><Pencil size={16} /></button><button aria-label="Excluir cliente" onClick={() => onRemove(client.id)}><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div></div>{editing && <ClientForm initial={editing} onClose={() => setEditing(null)} onSave={(draft) => { onUpdate({ ...editing, ...draft }); setEditing(null) }} />}</main>
}

function OrderAdmin({ orders, onBack }: { orders: Order[]; onBack: () => void }) {
  return <main className="admin-page"><div className="admin-header"><div><button className="back-link" onClick={onBack}>← Voltar ao catálogo</button><p className="eyebrow">Painel de controle</p><h1>Pedidos</h1><p>Reservas, pagamentos e entregas em um só lugar.</p></div></div><div className="dashboard-cards"><div><span>Pedidos ativos</span><strong>{orders.length}</strong><small className="positive">+ 12% este mês</small></div><div><span>Em andamento</span><strong>08</strong><small>atualizado agora</small></div><div><span>Receita estimada</span><strong>R$ 18.420</strong><small className="positive">+ 8,4% este mês</small></div></div><div className="data-panel"><div className="panel-head"><h2>Pedidos recentes</h2><button className="filter-button"><Filter size={16} /> Filtrar</button></div><div className="table-wrap"><table><thead><tr><th>Pedido</th><th>Cliente</th><th>Equipamento</th><th>Total</th><th>Status</th><th>Data</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td><strong>{order.id}</strong></td><td>{order.client}</td><td>{order.product}</td><td>{money(order.total)}</td><td><span className={order.status === 'Em andamento' ? 'stock' : 'stock low'}>{order.status}</span></td><td>{order.date}</td></tr>)}</tbody></table></div></div></main>
}

function CustomerArea({ client, orders, onClose, onRegister, onLogout, onSave }: { client: Client; orders: Order[]; onClose: () => void; onRegister: () => void; onLogout: () => void; onSave: (client: Client) => void }) {
  const [editing, setEditing] = useState(false)
  return <div className="modal-backdrop"><div className="customer-modal"><button className="modal-close icon-button" onClick={onClose}><X size={20} /></button><p className="eyebrow">Minha conta</p><h2>Olá, {client.name.split(' ')[0]}.</h2><div className="customer-tabs"><span className="active">Meus pedidos</span><span>Dados pessoais</span></div><section className="customer-section"><div className="customer-profile"><div className="profile-avatar">{client.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><div><strong>{client.name}</strong><span>{client.email}</span></div><button className="text-button" onClick={() => setEditing(true)}><Pencil size={15} /> Editar dados</button></div>{editing ? <ClientForm initial={client} compact onClose={() => setEditing(false)} onSave={(draft) => { onSave({ ...client, ...draft }); setEditing(false) }} /> : <div className="rental-history"><div className="history-heading"><h3>Histórico de locações</h3><span>{client.rentals} no total</span></div>{orders.filter((order) => order.client === client.name).map((order) => <div className="history-item" key={order.id}><div className="history-icon"><Package size={17} /></div><div><strong>{order.product}</strong><span>{order.id} · {order.date}</span></div><b>{money(order.total)}</b></div>)}{orders.filter((order) => order.client === client.name).length === 0 && <p className="empty-history">Suas próximas locações aparecerão aqui.</p>}</div>}</section></div></div>
}

function Checkout({ total, onClose, onDone }: { total: number; onClose: () => void; onDone: () => void }) {
  const [step, setStep] = useState(1)
  return <div className="modal-backdrop"><div className="checkout-modal"><button className="modal-close icon-button" onClick={onClose}><X size={20} /></button><p className="eyebrow">Finalizar reserva</p><h2>Quase lá.</h2><div className="checkout-steps"><span className="current">01 Dados</span><i></i><span className={step > 1 ? 'current' : ''}>02 Entrega</span><i></i><span className={step > 2 ? 'current' : ''}>03 Pagamento</span></div>{step === 1 && <div className="form-grid"><label>Nome completo<input placeholder="Como podemos te chamar?" /></label><label>CPF<input placeholder="000.000.000-00" /></label><label className="span-two">E-mail<input type="email" placeholder="voce@email.com" /></label><button className="primary-button span-two" onClick={() => setStep(2)}>Continuar <ArrowRight size={17} /></button></div>}{step === 2 && <div className="form-grid"><label className="span-two">Como prefere receber?<select><option>Entrega no meu endereço</option><option>Vou retirar no ponto parceiro</option></select></label><label className="span-two">Endereço de entrega<input placeholder="Rua, número, complemento" /></label><button className="primary-button span-two" onClick={() => setStep(3)}>Continuar <ArrowRight size={17} /></button></div>}{step === 3 && <div className="form-grid"><label className="span-two">Forma de pagamento<select><option>Cartão de crédito</option><option>PIX</option><option>Boleto</option></select></label><label>Nome no cartão<input placeholder="Nome impresso" /></label><label>Número do cartão<input placeholder="0000 0000 0000 0000" /></label><div className="checkout-summary span-two"><span>Total da reserva</span><strong>{money(total)} <small>/ dia</small></strong></div><button className="primary-button span-two" onClick={onDone}><Check size={17} /> Confirmar pedido</button></div>}</div></div>
}

type ClientDraft = Omit<Client, 'id' | 'rentals'>

function ClientForm({ initial, compact = false, onClose, onSave }: { initial?: Client; compact?: boolean; onClose: () => void; onSave: (client: ClientDraft) => void }) {
  const [name, setName] = useState(initial?.name || '')
  const [email, setEmail] = useState(initial?.email || '')
  const [phone, setPhone] = useState(initial?.phone || '')
  const [cpf, setCpf] = useState(initial?.cpf || '')
  const [address, setAddress] = useState(initial?.address || '')
  const valid = name.trim().length > 2 && email.includes('@') && digitsOnly(phone).length >= 10 && digitsOnly(cpf).length === 11 && address.trim().length > 5
  const missing = !name.trim() ? 'Informe seu nome completo.' : !email.includes('@') ? 'Informe um e-mail válido.' : digitsOnly(phone).length < 10 ? 'Informe um telefone válido.' : digitsOnly(cpf).length !== 11 ? 'Informe um CPF válido.' : address.trim().length <= 5 ? 'Informe seu endereço.' : ''
  return <div className={compact ? 'client-form compact' : 'modal-backdrop'}><div className="checkout-modal"><button className="modal-close icon-button" onClick={onClose}><X size={20} /></button><p className="eyebrow">{initial ? 'Atualizar cadastro' : 'Novo cliente'}</p><h2>{initial ? 'Editar dados.' : 'Criar conta.'}</h2><div className="form-grid"><label className="span-two">Nome completo<input value={name} onChange={(event) => setName(event.target.value)} maxLength={100} placeholder="Nome e sobrenome" /></label><label>E-mail<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} maxLength={120} placeholder="voce@email.com" /></label><label>Telefone<input value={phone} onChange={(event) => setPhone(formatPhone(event.target.value))} inputMode="numeric" maxLength={15} placeholder="(00) 00000-0000" /></label><label>CPF<input value={cpf} onChange={(event) => setCpf(formatCpf(event.target.value))} inputMode="numeric" maxLength={14} placeholder="000.000.000-00" /></label><label>Endereço<input value={address} onChange={(event) => setAddress(event.target.value)} maxLength={150} placeholder="Rua, número e cidade" /></label>{!valid && <p className="form-hint span-two">{missing}</p>}<button className="primary-button span-two" disabled={!valid} onClick={() => onSave({ name, email, phone, cpf, address })}>{initial ? 'Salvar alterações' : 'Cadastrar cliente'} <Check size={17} /></button></div></div></div>
}

function CheckoutValidated({ client, total, cart, onClose, onDone }: { client?: Client; total: number; cart: CartItem[]; onClose: () => void; onDone: (data: { name: string; email: string; delivery: string; address: string; payment: string }) => void }) {
  const [step, setStep] = useState(client ? 2 : 1)
  const [name, setName] = useState(client?.name || '')
  const [email, setEmail] = useState(client?.email || '')
  const [delivery, setDelivery] = useState('Entrega no meu endereço')
  const [address, setAddress] = useState(client?.address || '')
  const [payment, setPayment] = useState('Cartão de crédito')
  const [card, setCard] = useState('')
  const [pixCopied, setPixCopied] = useState(false)
  const stockValid = cart.every((item) => item.quantity <= item.stock)
  const customerValid = name.trim().length > 2 && email.includes('@')
  const deliveryValid = delivery.includes('retirar') || address.trim().length > 8
  const paymentValid = payment === 'PIX' || payment === 'Boleto' || card.replace(/\D/g, '').length >= 12
  const error = !stockValid ? 'A quantidade de algum produto excede o estoque disponível.' : ''
  return <div className="modal-backdrop"><div className="checkout-modal"><button className="modal-close icon-button" onClick={onClose}><X size={20} /></button><p className="eyebrow">Finalizar reserva</p><h2>Quase lá.</h2><div className="checkout-steps"><span className={step >= 1 ? 'current' : ''}>01 Dados</span><i></i><span className={step >= 2 ? 'current' : ''}>02 Entrega</span><i></i><span className={step >= 3 ? 'current' : ''}>03 Pagamento</span></div>{error && <p className="form-error">{error}</p>}{step === 1 && <div className="form-grid"><label className="span-two">Nome completo<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Como podemos te chamar?" /></label><label className="span-two">E-mail<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@email.com" /></label><button className="primary-button span-two" disabled={!customerValid || !stockValid} onClick={() => setStep(2)}>Continuar <ArrowRight size={17} /></button></div>}{step === 2 && <div className="form-grid"><label className="span-two">Como prefere receber?<select value={delivery} onChange={(event) => setDelivery(event.target.value)}><option>Entrega no meu endereço</option><option>Vou retirar no ponto parceiro</option></select></label>{delivery.includes('endereço') && <label className="span-two">Endereço de entrega<input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Rua, número, complemento e cidade" /></label>}<button className="primary-button span-two" disabled={!deliveryValid} onClick={() => setStep(3)}>Continuar <ArrowRight size={17} /></button></div>}{step === 3 && <div className="form-grid"><label className="span-two">Forma de pagamento<select value={payment} onChange={(event) => { setPayment(event.target.value); setPixCopied(false) }}><option>Cartão de crédito</option><option>PIX</option><option>Boleto</option></select></label>{payment === 'Cartão de crédito' && <label className="span-two">Número do cartão<input value={card} onChange={(event) => setCard(event.target.value)} placeholder="0000 0000 0000 0000" /></label>}{payment === 'PIX' && <PixPayment copied={pixCopied} onCopy={() => { navigator.clipboard?.writeText('nickolas@alugae.com.br'); setPixCopied(true) }} />}<div className="checkout-summary span-two"><span>Total da reserva · {cart.length} item(ns)</span><strong>{money(total)} <small>/ dia</small></strong></div><button className="primary-button span-two" disabled={!paymentValid || !stockValid} onClick={() => onDone({ name, email, delivery, address, payment })}><Check size={17} /> Confirmar pedido</button></div>}</div></div>
}

function ProductForm({ initial, onClose, onSave }: { initial?: Product; onClose: () => void; onSave: (product: Omit<Product, 'id'>) => Promise<void> }) {
  const [name, setName] = useState(initial?.name || '')
  const [brand, setBrand] = useState(initial?.brand || '')
  const [model, setModel] = useState(initial?.model || '')
  const [category, setCategory] = useState(initial?.category || 'Tecnologia')
  const [price, setPrice] = useState(initial ? String(initial.price) : '')
  const [stock, setStock] = useState(initial ? String(initial.stock) : '')
  const [image, setImage] = useState(initial?.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&h=675&q=85')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const valid = name.trim() && brand.trim() && model.trim() && Number(price) > 0 && Number(stock) >= 0
  function selectImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setImage(URL.createObjectURL(file))
    setSelectedFile(file)
  }
  async function submit() {
    setUploading(true)
    let productImage = image
    if (selectedFile) {
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result).split(',')[1] || '')
        reader.onerror = reject
        reader.readAsDataURL(selectedFile)
      })
      const extension = selectedFile.name.split('.').pop()?.toLowerCase() || 'jpg'
      const uploaded = await api.uploads.file(`${fileSlug(name)}.${extension}`, selectedFile.type, data) as { url: string }
      productImage = uploaded.url
    }
    await onSave({ name, brand, model, category, price: Number(price), stock: Number(stock), image: productImage, tone: initial?.tone || 'blue' })
    setUploading(false)
  }
  return <div className="modal-backdrop"><div className="checkout-modal product-form"><button className="modal-close icon-button" onClick={onClose}><X size={20} /></button><p className="eyebrow">{initial ? 'Atualizar item' : 'Novo item'}</p><h2>{initial ? 'Editar produto.' : 'Cadastrar produto.'}</h2><div className="form-grid"><label className="span-two">Nome do produto<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex: Mouse Dell" /></label><label>Marca<input value={brand} onChange={(event) => setBrand(event.target.value)} placeholder="Ex: Dell" /></label><label>Modelo<input value={model} onChange={(event) => setModel(event.target.value)} placeholder="Ex: MS116" /></label><label>Categoria<select value={category} onChange={(event) => setCategory(event.target.value)}><option>Tecnologia</option><option>Fotografia</option><option>Eventos</option><option>Estúdio</option><option>Vídeo</option><option>Games</option></select></label><label>Valor / dia<input type="number" min="0" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="0" /></label><label>Quantidade<input type="number" min="0" value={stock} onChange={(event) => setStock(event.target.value)} placeholder="0" /></label><label className="upload-field"><span><Upload size={16} /> {uploading ? 'Enviando foto...' : 'Foto do produto'}</span><small>{selectedFile ? `Será salvo como ${fileSlug(name) || 'produto'}.${selectedFile.name.split('.').pop() || 'jpg'}` : 'PNG ou JPG até 5MB'}</small><input type="file" accept="image/png,image/jpeg,image/webp" onChange={selectImage} /></label><button className="primary-button span-two" disabled={!valid || uploading} onClick={submit}>{uploading ? 'Salvando produto...' : initial ? 'Salvar produto' : 'Cadastrar produto'} <Check size={17} /></button></div></div></div>
}

export default App
