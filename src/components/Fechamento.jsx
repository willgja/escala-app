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
          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 12 }}>
            Fechamento — {MESES[mes]} {ano}
          </div>

          <table>
            <thead>
              <tr>
                <th>Colaborador</th>
                <th>Matrícula</th>
                <th>Diurnas</th>
                <th>Noturnas</th>
                <th>Total Diárias</th>
                <th>Valor (R$ {Number(valorDiaria).toLocaleString('pt-BR', { minimumFractionDigits: 2 })})</th>
              </tr>
            </thead>
            <tbody>
              {colaboradores.map(c => {
                const d = contagem[c.id]?.d || 0
                const n = contagem[c.id]?.n || 0
                const t = d + n
                if (t === 0) return null; // Melhor visualização não mostrar quem tem 0 no mês
                const v = t * valorDiaria
                return (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500 }}>{c.nome}</td>
                    <td>{c.mat || '-'}</td>
                    <td><span className="badge badge-d">{d}</span></td>
                    <td><span className="badge badge-n">{n}</span></td>
                    <td><span className="badge-count">{t}</span></td>
                    <td><span className="badge-money">{fmtBRL(v)}</span></td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} style={{ textAlign: 'right', color: '#6b6b67', fontSize: 13 }}>Total do período</td>
                <td><span className="badge-count">{totalDiarias}</span></td>
                <td><span className="badge-money">{fmtBRL(totalValor)}</span></td>
              </tr>
            </tfoot>
          </table>

          <div className="grand-total">
            <span className="grand-total-label">Total geral a pagar — {MESES[mes]} {ano}</span>
            <span className="grand-total-value">{fmtBRL(totalValor)}</span>
          </div>
        </>
      )}
    </div>
  )
}
