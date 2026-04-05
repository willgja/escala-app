import { useState } from 'react'
import { api } from '../api'

export default function Colaboradores() {
  const [nome, setNome] = useState('')
  const [mat, setMat] = useState('')
  const [func, setFunc] = useState('')

  async function adicionar() {
    if (!nome.trim()) { alert('Informe o nome.'); return }
    try {
      await api.post('/colaboradores', { 
        nome: nome.trim(), 
        mat: mat.trim(), 
        func: func.trim() 
      })
      alert('Colaborador cadastrado com sucesso')
      setNome(''); setMat(''); setFunc('')
    } catch (error) {
      alert('Erro ao salvar colaborador')
    }
  }

  return (
    <div>
      <div className="card">
        <div className="card-title">Cadastrar Colaborador</div>
        <div className="form-row">
          <div className="form-col">
            <label className="form-label">Nome completo</label>
            <input type="text" placeholder="Ex: João Silva" value={nome} onChange={e => setNome(e.target.value)} />
          </div>
          <div className="form-col">
            <label className="form-label">Matrícula</label>
            <input type="text" placeholder="Ex: 001" value={mat} onChange={e => setMat(e.target.value)} />
          </div>
          <div className="form-col">
            <label className="form-label">Função</label>
            <input type="text" placeholder="Ex: Técnico" value={func} onChange={e => setFunc(e.target.value)} />
          </div>
        </div>
        <button className="btn btn-primary" onClick={adicionar}>+ Cadastrar</button>
      </div>
    </div>
  )
}
