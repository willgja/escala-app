import { useState, useEffect } from 'react'
import { api } from '../api'

const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

function getSegunda(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDias(d, n) {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

function semanaKey(d) {
  return d.toISOString().slice(0, 10)
}

function fmtDia(d) {
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

function fmtBRL(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function Escala() {
  const [colaboradores, setColaboradores] = useState([])
  const [escalas, setEscalas] = useState({})
  const [currentSemana, setCurrentSemana] = useState(getSegunda(new Date()))
  const [busca, setBusca] = useState('')
  const [valorDiaria, setValorDiaria] = useState(400)

  useEffect(() => {
    api.get('/colaboradores').then(res => setColaboradores(res.data))
    api.get('/escalas').then(res => setEscalas(res.data))
    api.get('/config').then(res => setValorDiaria(res.data.valor))
  }, [])

  function navSemana(n) {
    setCurrentSemana(prev => addDias(prev, n * 7))
  }

  function getSlot(cid, diaKey, turno) {
    return escalas[diaKey]?.[cid]?.[turno] || 0
  }

  async function toggleSlot(cid, diaKey, turno) {
    try {
      const res = await api.post('/escalas/toggle', { colaboradorId: cid, data: diaKey, turno })
      const novas = { ...escalas }
      if (!novas[diaKey]) novas[diaKey] = {}
      if (!novas[diaKey][cid]) novas[diaKey][cid] = {}
      
      novas[diaKey][cid][turno] = res.data.action === 'added' ? 1 : 0
      setEscalas(novas)
    } catch (e) {
      alert('Erro ao alterar escala')
    }
  }

  const days = DIAS.map((_, i) => {
    const d = addDias(currentSemana, i)
    return { label: DIAS[i] + ' ' + fmtDia(d), key: semanaKey(d) }
  })

  const lista = colaboradores.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase())
  )

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `140px repeat(7, 1fr)`
  }

  return (
    <div>
      <div className="escala-semana-nav" style={{marginTop: 16}}>
        <button className="nav-arrow" onClick={() => navSemana(-1)}>&#x276E;</button>
        <div className="nav-date-label">
          {fmtDia(currentSemana)} – {fmtDia(addDias(currentSemana, 6))}
        </div>
        <button className="nav-arrow" onClick={() => navSemana(1)}>&#x276F;</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Filtrar colaborador..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          style={{ width: '100%', maxWidth: '100%' }}
        />
        <div className="cal-legend">
          <div className="legend-item">
            <div className="legend-color" style={{background: 'var(--accent)'}}></div> Diurno
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{background: 'var(--warning)'}}></div> Noturno
          </div>
        </div>
      </div>

      {lista.length === 0 ? (
        <div className="empty-state">Nenhum colaborador cadastrado.</div>
      ) : (
        <div style={{ marginTop: 24 }}>
          {lista.map(c => (
            <div key={c.id} className="calendario-card">
              <div style={{ fontSize: 18, color: 'var(--text-main)', marginBottom: 16, fontWeight: 700 }}>
                {c.nome}
              </div>
              <div className="cal-header-row">
                {days.map(d => <div key={`hdr-${d.key}`} className="cal-header-day">{d.label.split(' ')[0]}</div>)}
              </div>
              <div className="cal-days-grid">
                {days.map(d => {
                  const diaNum = d.label.split(' ')[1] ? d.label.split(' ')[1].split('/')[0] : '0';
                  const sd = getSlot(c.id, d.key, 'd');
                  const sn = getSlot(c.id, d.key, 'n');
                  
                  return (
                    <div key={d.key} className="cal-day-box">
                      <span className="cal-day-num">{diaNum}</span>
                      <div className="cal-actions">
                        <button 
                          className={`micro-btn ${sd ? 'd-on' : ''}`} 
                          onClick={() => toggleSlot(c.id, d.key, 'd')}
                        >D</button>
                        <button 
                          className={`micro-btn ${sn ? 'n-on' : ''}`} 
                          onClick={() => toggleSlot(c.id, d.key, 'n')}
                        >N</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
