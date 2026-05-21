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
          width: 200,
          background: '#1a1a2e',
          padding: '24px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        }}>
          <div style={{ color: '#fff', fontWeight: 'bold', padding: '0 20px 20px' }}>
            amtaf 管理画面
          </div>
          {[
            { to: '/genres', label: 'ジャンル' },
            { to: '/categories', label: 'カテゴリ' },
            { to: '/sets', label: 'セット' },
            { to: '/products', label: '商品' },
          ].map(({ to, label }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              display: 'block',
              padding: '10px 20px',
              color: isActive ? '#fff' : '#aaa',
              background: isActive ? '#16213e' : 'transparent',
              textDecoration: 'none',
              fontSize: 14,
            })}>
              {label}
            </NavLink>
          ))}
        </nav>
        <main style={{ flex: 1, padding: 32, background: '#f5f5f5' }}>
          <Routes>
            <Route path="/genres" element={<Genres />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/sets" element={<Sets />} />
            <Route path="/products" element={<Products />} />
            <Route path="/" element={<div>左のメニューから選んでください</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}