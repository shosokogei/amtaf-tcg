import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')

  const fetch = async () => {
    const snap = await getDocs(collection(db, 'categories'))
    setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  useEffect(() => { fetch() }, [])

  const add = async () => {
    if (!name || !slug) return
    await addDoc(collection(db, 'categories'), {
      name,
      slug,
      sort_order: categories.length + 1
    })
    setName('')
    setSlug('')
    fetch()
  }

  const remove = async (id) => {
    await deleteDoc(doc(db, 'categories', id))
    fetch()
  }

  return (
    <div>
      <h2 style={h2}>カテゴリ管理</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input placeholder="名前（例：ブースターパック）" value={name} onChange={e => setName(e.target.value)} style={input} />
        <input placeholder="スラッグ（例：booster）" value={slug} onChange={e => setSlug(e.target.value)} style={input} />
        <button onClick={add} style={btn}>追加</button>
      </div>
      <table style={table}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th style={th}>名前</th>
            <th style={th}>スラッグ</th>
            <th style={th}>順番</th>
            <th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {categories.map(c => (
            <tr key={c.id}>
              <td style={td}>{c.name}</td>
              <td style={td}>{c.slug}</td>
              <td style={td}>{c.sort_order}</td>
              <td style={td}><button onClick={() => remove(c.id)} style={deleteBtn}>削除</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const h2 = { marginBottom: 20, color: '#2b2b2b' }
const input = { padding: '6px 10px', width: 220, border: '1px solid #ddd', borderRadius: 4 }
const btn = { padding: '6px 20px', background: '#f5a623', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }
const deleteBtn = { padding: '4px 12px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }
const table = { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8 }
const th = { padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid #ddd', color: '#555' }
const td = { padding: '10px 14px', borderBottom: '1px solid #f0f0f0' }