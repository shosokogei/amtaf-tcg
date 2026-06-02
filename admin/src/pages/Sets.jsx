import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore'

export default function Sets() {
  const [sets, setSets] = useState([])
  const [genres, setGenres] = useState([])
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [genreId, setGenreId] = useState('')
  const [categoryId, setCategoryId] = useState('')

  const fetchAll = async () => {
    const [setSnap, genSnap, catSnap] = await Promise.all([
      getDocs(collection(db, 'sets')),
      getDocs(collection(db, 'genres')),
      getDocs(collection(db, 'categories'))
    ])
    setSets(setSnap.docs.map(d => ({ id: d.id, ...d.data() })))
    setGenres(genSnap.docs.map(d => ({ id: d.id, ...d.data() })))
    setCategories(catSnap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  useEffect(() => { fetchAll() }, [])

  const add = async () => {
    if (!name || !genreId || !categoryId) return
    await addDoc(collection(db, 'sets'), {
      name,
      code,
      genre_id: genreId,
      category_id: categoryId,
      sort_order: sets.length + 1
    })
    setName('')
    setCode('')
    fetchAll()
  }

  const remove = async (id) => {
    await deleteDoc(doc(db, 'sets', id))
    fetchAll()
  }

  const genreName = (id) => genres.find(g => g.id === id)?.name ?? '-'
  const catName = (id) => categories.find(c => c.id === id)?.name ?? '-'

  return (
    <div>
      <h2 style={h2}>セット管理</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        <select value={genreId} onChange={e => setGenreId(e.target.value)} style={select}>
          <option value="">ジャンルを選択</option>
          {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <select value={categoryId} onChange={e => setCategoryId(e.target.value)} style={select}>
          <option value="">カテゴリを選択</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input placeholder="セット名（例：BLAZING VORTEX）" value={name} onChange={e => setName(e.target.value)} style={{ ...input, width: 240 }} />
        <input placeholder="コード（例：BLVO）" value={code} onChange={e => setCode(e.target.value)} style={{ ...input, width: 100 }} />
        <button onClick={add} style={btn}>追加</button>
      </div>
      <table style={table}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th style={th}>ジャンル</th>
            <th style={th}>カテゴリ</th>
            <th style={th}>セット名</th>
            <th style={th}>コード</th>
            <th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {sets.map(s => (
            <tr key={s.id}>
              <td style={td}>{genreName(s.genre_id)}</td>
              <td style={td}>{catName(s.category_id)}</td>
              <td style={td}>{s.name}</td>
              <td style={td}>{s.code}</td>
              <td style={td}><button onClick={() => remove(s.id)} style={deleteBtn}>削除</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const h2 = { marginBottom: 20, color: '#2b2b2b' }
const input = { padding: '6px 10px', border: '1px solid #ddd', borderRadius: 4 }
const select = { padding: '6px 10px', border: '1px solid #ddd', borderRadius: 4 }
const btn = { padding: '6px 20px', background: '#f5a623', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }
const deleteBtn = { padding: '4px 12px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }
const table = { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8 }
const th = { padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid #ddd', color: '#555' }
const td = { padding: '10px 14px', borderBottom: '1px solid #f0f0f0' }