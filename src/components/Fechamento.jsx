import { useState, useEffect } from 'react'
import { api } from '../api'

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

function semanaKey(d) { return d.toISOString().slice(0, 10) }
function fmtBRL(v) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }

export default function Fechamento() {
  const now = new Date()
  const [mes, setMes] = useState(now.getMonth())
  const [ano, setAno] = useState(now.getFullYear())
  
  const [colaboradores, setColaboradores] = useState([])
  const [escalas, setEscalas] = useState({})

  const [valorDiaria, setValorDiaria] = useState(400)
  const [inputValor, setInputValor] = useState(400)
  const [valorSalvo, setValorSalvo] = useState(false)

  useEffect(() => {
    api.get('/colaboradores').then(res => setColaboradores(res.data))
    api.get('/escalas').then(res => setEscalas(res.data))
    api.get('/config').then(res => {
      setValorDiaria(res.data.valor)
      setInputValor(res.data.valor)
    })
  }, [])

  async function salvarValor() {
    const v = parseFloat(inputValor)
    if (isNaN(v) || v < 0) { alert('Informe um valor válido.'); return }
    try {
      const res = await api.put('/config', { valor: v })
      setValorDiaria(res.data.valor)
      setValorSalvo(true)
      setTimeout(() => setValorSalvo(false), 2000)
    } catch (e) {
      alert('Erro ao salvar valor da diária')
    }
  }

  function calcular() {
    const contagem = {}
    colaboradores.forEach(c => { contagem[c.id] = { d: 0, n: 0 } })

    const inicio = new Date(ano, mes, 1)
    const fim = new Date(ano, mes + 1, 0)

    for (let d = new Date(inicio); d <= fim; d.setDate(d.getDate() + 1)) {
      const key = semanaKey(d)
      if (!escalas[key]) continue
      Object.keys(escalas[key]).forEach(cid => {
        if (!contagem[cid]) contagem[cid] = { d: 0, n: 0 }
        contagem[cid].d += escalas[key][cid].d || 0
        contagem[cid].n += escalas[key][cid].n || 0
      })
    }
    return contagem
  }

  const contagem = calcular()
  let totalDiarias = 0
  let totalValor = 0
  colaboradores.forEach(c => {
    const t = (contagem[c.id]?.d || 0) + (contagem[c.id]?.n || 0)
    totalDiarias += t
    totalValor += t * valorDiaria
  })

  return (
    <div>
      <div className="card">
        <div className="card-title">Selecionar período</div>
        <div className="form-row" style={{ alignItems: 'flex-end' }}>
          <div className="form-col" style={{ maxWidth: 140 }}>
            <label className="form-label">Mês</label>
            <select value={mes} onChange={e => setMes(parseInt(e.target.value))}>
              {MESES.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
          </div>
          <div className="form-col" style={{ maxWidth: 100 }}>
            <label className="form-label">Ano</label>
            <input type="number" value={ano} onChange={e => setAno(parseInt(e.target.value))} />
          </div>
        </div>
      </div>

      <div className="valor-box">
        <label>Valor da diária (R$):</label>
        <input
          type="number"
          value={inputValor}
          min="0"
          step="0.01"
          onChange={e => setInputValor(e.target.value)}
          style={{ maxWidth: 110 }}
        />
        <button className="btn btn-primary btn-sm" onClick={salvarValor}>Salvar valor</button>
        {valorSalvo && <span className="valor-salvo">✓ Salvo!</span>}
      </div>

      {colaboradores.length === 0 ? (
        <div className="empty-state">Nenhum colaborador cadastrado.</div>
      ) : (
        <>
          <div className="resumo-title" style={{ marginTop: '32px' }}>Resumo do Mês</div>
          <div className="resumo-grid">
            <div className="resumo-box">
              <span className="resumo-label">Dias Trabalhados</span>
              <span className="resumo-value clamp">{totalDiarias}</span>
            </div>
            <div className="resumo-box">
              <span className="resumo-label">Acionamentos</span>
              <span className="resumo-value clamp">{colaboradores.filter(c => ((contagem[c.id]?.d || 0) + (contagem[c.id]?.n || 0)) > 0).length}</span>
            </div>
            <div className="resumo-box">
              <span className="resumo-label">Horas Totais</span>
              <span className="resumo-value accent clamp">A calcular</span>
            </div>
            <div className="resumo-box">
              <span className="resumo-label">Total a Receber</span>
              <span className="resumo-value green clamp">{fmtBRL(totalValor)}</span>
            </div>
          </div>

          <div style={{ marginTop: '32px' }}>
            <div className="resumo-title">Acionamentos do Mês ({colaboradores.length})</div>
            {colaboradores.map(c => {
              const d = contagem[c.id]?.d || 0;
              const n = contagem[c.id]?.n || 0;
              const t = d + n;
              if (t === 0) return null;
              const v = t * valorDiaria;
              return (
                <div key={c.id} className="acionamento-item">
                  <div className="ac-row">
                    <span className="ac-date">{c.nome}</span>
                    <span className="ac-value">{fmtBRL(v)}</span>
                  </div>
                  <div className="ac-row" style={{ marginTop: 8 }}>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <div>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block' }}>MATRÍCULA</span>
                        <span className="ac-user">{c.mat || 'S/N'}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block' }}>DIÁRIAS</span>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{t}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: 13, background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent)', padding: '4px 8px', borderRadius: 6, fontWeight: 500 }}>
                      D: {d} | N: {n}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  )
}
