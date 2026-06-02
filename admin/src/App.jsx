import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Genres from './pages/Genres'
import Categories from './pages/Categories'
import Sets from './pages/Sets'
import Products from './pages/Products'
export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <nav style={{
          width: 220,
          background: '#2b2b2b',
          padding: '0',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid #3a3a3a',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <span style={{ color: '#f5a623', fontWeight: 'bold', fontSize: 18, letterSpacing: 2 }}>AMTAF</span>
            <span style={{ color: '#888', fontSize: 12 }}>管理画面</span>
          </div>
          {[
            { to: '/genres', label: 'ジャンル' },
            { to: '/categories', label: 'カテゴリ' },
            { to: '/sets', label: 'セット' },
            { to: '/products', label: '商品' },
          ].map(({ to, label }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              display: 'block',
              padding: '12px 24px',
              color: isActive ? '#f5a623' : '#ccc',
              background: isActive ? '#3a3a3a' : 'transparent',
              textDecoration: 'none',
              fontSize: 14,
              borderLeft: isActive ? '3px solid #f5a623' : '3px solid transparent',
            })}>
              {label}
            </NavLink>
          ))}
        </nav>
        <main style={{ flex: 1, padding: 32, background: '#f7f7f7' }}>
          <Routes>
            <Route path="/genres" element={<Genres />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/sets" element={<Sets />} />
            <Route path="/products" element={<Products />} />
            <Route path="/" element={<div style={{ color: '#888' }}>左のメニューから選んでください</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}