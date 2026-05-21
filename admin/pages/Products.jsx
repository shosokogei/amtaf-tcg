import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'

export default function Products() {
  const [products, setProducts] = useState([])
  const [sets, setSets] = useState([])
  const [form, setForm] = useState({
    set_id: '', name: '', card_number: '',
    rarity: '', language: 'ja', condition: 'A',
    price: '', stock: ''
  })

  const fetchAll = async () => {
    const [prodSnap, setSnap] = await Promise.all([
      getDocs(collection(db, 'products')),
      getDocs(collection(db, 'sets'))
    ])
    setProducts(prodSnap.docs.map(d => ({ id: d.id, ...d.data() })))
    setSets(setSnap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  useEffect(() => { fetchAll() }, [])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const add = async () => {
    if (!form.set_id || !form.name || !form.price) return
    await addDoc(collection(db, 'products'), {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    })
    setForm({ set_id: '', name: '', card_number: '', rarity: '', language: 'ja', condition: 'A', price: '', stock: '' })
    fetchAll()
  }

  const remove = async (id) => {
    await deleteDoc(doc(db, 'products', id))
    fetchAll()
  }

  const setName = (id) => sets.find(s => s.id === id)?.name ?? '-'

  return (
    <div>
      <h2>商品管理</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24, background: '#fff', padding: 16, borderRadius: 8 }}>
        <select value={form.set_id} onChange={e => set('set_id', e.target.value)} style={{ padding: '6px 10px' }}>
          <option value="">セットを選択</option>
          {sets.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input placeholder="カード名" value={form.name} onChange={e => set('name', e.target.value)} style={{ padding: '6px 10px', width: 180 }} />
        <input placeholder="カード番号" value={form.card_number} onChange={e => set('card_number', e.target.value)} style={{ padding: '6px 10px', width: 120 }} />
        <input placeholder="レアリティ" value={form.rarity} onChange={e => set('rarity', e.target.value)} style={{ padding: '6px 10px', width: 120 }} />
        <select value={form.condition} onChange={e => set('condition', e.target.value)} style={{ padding: '6px 10px' }}>
          {['A', 'B', 'C', 'D'].map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={form.language} onChange={e => set('language', e.target.value)} style={{ padding: '6px 10px' }}>
          <option value="ja">日本語</option>
          <option value="en">英語</option>
          <option value="kr">韓国語</option>
        </select>
        <input placeholder="価格（円）" value={form.price} onChange={e => set('price', e.target.value)} style={{ padding: '6px 10px', width: 100 }} type="number" />
        <input placeholder="在庫数" value={form.stock} onChange={e => set('stock', e.target.value)} style={{ padding: '6px 10px', width: 80 }} type="number" />
        <button onClick={add} style={{ padding: '6px 16px' }}>追加</button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th style={th}>セット</th>
            <th style={th}>カード名</th>
            <th style={th}>番号</th>
            <th style={th}>レア</th>
            <th style={th}>状態</th>
            <th style={th}>言語</th>
            <th style={th}>価格</th>
            <th style={th}>在庫</th>
            <th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td style={td}>{setName(p.set_id)}</td>
              <td style={td}>{p.name}</td>
              <td style={td}>{p.card_number}</td>
              <td style={td}>{p.rarity}</td>
              <td style={td}>{p.condition}</td>
              <td style={td}>{p.language}</td>
              <td style={td}>¥{p.price?.toLocaleString()}</td>
              <td style={td}>{p.stock}</td>
              <td style={td}>
                <button onClick={() => remove(p.id)} style={{ color: 'red' }}>削除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const th = { padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #ddd' }
const td = { padding: '8px 12px', borderBottom: '1px solid #eee' }