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
    gridTemplateColumns: `140px repeat(7, 1fr)`
  }

  return (
    <div>
      <div className="semana-nav">
        <button className="btn btn-outline btn-sm" onClick={() => navSemana(-1)}>← Anterior</button>
        <div className="semana-label">
          {fmtDia(currentSemana)} – {fmtDia(addDias(currentSemana, 6))}
        </div>
        <button className="btn btn-outline btn-sm" onClick={() => navSemana(1)}>Próxima →</button>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Filtrar colaborador..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          style={{ maxWidth: 220 }}
        />
        <span style={{ fontSize: 12, color: '#6b6b67' }}>
          <span className="badge badge-d">D</span> Diurno &nbsp;
          <span className="badge badge-n">N</span> Noturno &nbsp; — clique para escalar
        </span>
      </div>

      {lista.length === 0 ? (
        <div className="empty-state">Nenhum colaborador cadastrado.</div>
      ) : (
        <>
          <div className="escala-grid" style={gridStyle}>
            <div className="eg-cell eg-header">Colaborador</div>
            {days.map(d => (
              <div key={d.key} className="eg-cell eg-header">{d.label}</div>
            ))}

            {lista.map(c => (
              <div key={c.id} style={{display: 'contents'}}>
                <div className="eg-cell eg-name">{c.nome}</div>
                {days.map(d => {
                  const sd = getSlot(c.id, d.key, 'd')
                  const sn = getSlot(c.id, d.key, 'n')
                  return (
                    <div key={d.key} className="eg-cell">
                      <div className="eg-turno">
                        <div
                          className={`slot ${sd ? 'slot-d' : 'slot-empty'}`}
                          onClick={() => toggleSlot(c.id, d.key, 'd')}
                          title={sd ? 'Remover diurno' : 'Escalar diurno'}
                        >D</div>
                        <div
                          className={`slot ${sn ? 'slot-n' : 'slot-empty'}`}
                          onClick={() => toggleSlot(c.id, d.key, 'n')}
                          title={sn ? 'Remover noturno' : 'Escalar noturno'}
                        >N</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Resumo da semana</div>
          <div className="resumo-semana">
            {lista.map(c => {
              let dt = 0, nt = 0
              days.forEach(d => { dt += getSlot(c.id, d.key, 'd'); nt += getSlot(c.id, d.key, 'n') })
              const t = dt + nt
              if (t === 0) return null
              return (
                <div key={'res-'+c.id} className="resumo-item">
                  <span className="resumo-nome">{c.nome}</span>
                  <span className="badge-count">{t} diária(s)</span>
                  <span className="badge-money">{fmtBRL(t * valorDiaria)}</span>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
