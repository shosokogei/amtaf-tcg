import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [genres, setGenres] = useState([])
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [genreId, setGenreId] = useState('')

  const fetchAll = async () => {
    const [catSnap, genSnap] = await Promise.all([
      getDocs(collection(db, 'categories')),
      getDocs(collection(db, 'genres'))
    ])
    setCategories(catSnap.docs.map(d => ({ id: d.id, ...d.data() })))
    setGenres(genSnap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  useEffect(() => { fetchAll() }, [])

  const add = async () => {
    if (!name || !slug || !genreId) return
    await addDoc(collection(db, 'categories'), {
      name,
      slug,
      genre_id: genreId,
      sort_order: categories.length + 1
    })
    setName('')
    setSlug('')
    fetchAll()
  }

  const remove = async (id) => {
    await deleteDoc(doc(db, 'categories', id))
    fetchAll()
  }

  const genreName = (id) => genres.find(g => g.id === id)?.name ?? '-'

  return (
    <div>
      <h2>カテゴリ管理</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <select value={genreId} onChange={e => setGenreId(e.target.value)} style={{ padding: '6px 10px' }}>
          <option value="">ジャンルを選択</option>
          {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <input
          placeholder="名前（例：ブースターパック）"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ padding: '6px 10px', width: 200 }}
        />
        <input
          placeholder="スラッグ（例：booster）"
          value={slug}
          onChange={e => setSlug(e.target.value)}
          style={{ padding: '6px 10px', width: 200 }}
        />
        <button onClick={add} style={{ padding: '6px 16px' }}>追加</button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th style={th}>ジャンル</th>
            <th style={th}>名前</th>
            <th style={th}>スラッグ</th>
            <th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {categories.map(c => (
            <tr key={c.id}>
              <td style={td}>{genreName(c.genre_id)}</td>
              <td style={td}>{c.name}</td>
              <td style={td}>{c.slug}</td>
              <td style={td}>
                <button onClick={() => remove(c.id)} style={{ color: 'red' }}>削除</button>
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