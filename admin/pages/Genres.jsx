import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore'

export default function Genres() {
  const [genres, setGenres] = useState([])
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')

  const fetch = async () => {
    const snap = await getDocs(collection(db, 'genres'))
    setGenres(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  useEffect(() => { fetch() }, [])

  const add = async () => {
    if (!name || !slug) return
    await addDoc(collection(db, 'genres'), {
      name,
      slug,
      sort_order: genres.length + 1
    })
    setName('')
    setSlug('')
    fetch()
  }

  const remove = async (id) => {
    await deleteDoc(doc(db, 'genres', id))
    fetch()
  }

  return (
    <div>
      <h2>ジャンル管理</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input
          placeholder="名前（例：遊戯王）"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ padding: '6px 10px', width: 200 }}
        />
        <input
          placeholder="スラッグ（例：yugioh）"
          value={slug}
          onChange={e => setSlug(e.target.value)}
          style={{ padding: '6px 10px', width: 200 }}
        />
        <button onClick={add} style={{ padding: '6px 16px' }}>追加</button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th style={th}>名前</th>
            <th style={th}>スラッグ</th>
            <th style={th}>順番</th>
            <th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {genres.map(g => (
            <tr key={g.id}>
              <td style={td}>{g.name}</td>
              <td style={td}>{g.slug}</td>
              <td style={td}>{g.sort_order}</td>
              <td style={td}>
                <button onClick={() => remove(g.id)} style={{ color: 'red' }}>削除</button>
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