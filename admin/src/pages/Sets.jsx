import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore'

export default function Sets() {
  const [sets, setSets] = useState([])
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [categoryId, setCategoryId] = useState('')

  const fetchAll = async () => {
    const [setSnap, catSnap] = await Promise.all([
      getDocs(collection(db, 'sets')),
      getDocs(collection(db, 'categories'))
    ])
    setSets(setSnap.docs.map(d => ({ id: d.id, ...d.data() })))
    setCategories(catSnap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  useEffect(() => { fetchAll() }, [])

  const add = async () => {
    if (!name || !categoryId) return
    await addDoc(collection(db, 'sets'), {
      name,
      code,
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

  const catName = (id) => categories.find(c => c.id === id)?.name ?? '-'

  return (
    <div>
      <h2>セット管理</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <select value={categoryId} onChange={e => setCategoryId(e.target.value)} style={{ padding: '6px 10px' }}>
          <option value="">カテゴリを選択</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input
          placeholder="セット名（例：BLAZING VORTEX）"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ padding: '6px 10px', width: 220 }}
        />
        <input
          placeholder="コード（例：BLVO）"
          value={code}
          onChange={e => setCode(e.target.value)}
          style={{ padding: '6px 10px', width: 100 }}
        />
        <button onClick={add} style={{ padding: '6px 16px' }}>追加</button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th style={th}>カテゴリ</th>
            <th style={th}>セット名</th>
            <th style={th}>コード</th>
            <th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {sets.map(s => (
            <tr key={s.id}>
              <td style={td}>{catName(s.category_id)}</td>
              <td style={td}>{s.name}</td>
              <td style={td}>{s.code}</td>
              <td style={td}>
                <button onClick={() => remove(s.id)} style={{ color: 'red' }}>削除</button>
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