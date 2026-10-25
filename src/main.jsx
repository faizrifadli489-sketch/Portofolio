import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const root = createRoot(document.getElementById('root'))

// Error boundary sederhana: kalau WebGL tidak tersedia atau scene gagal,
// portofolio tetap terbaca (degrades gracefully) alih-alih layar hitam.
class Boundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(err) {
    console.warn('[scene] gagal dimuat:', err?.message || err)
    document.documentElement.classList.add('no-3d')
  }
  render() {
    if (this.state.failed) {
      return React.cloneElement(this.props.children, { withoutScene: true })
    }
    return this.props.children
  }
}

root.render(
  <React.StrictMode>
    <Boundary>
      <App />
    </Boundary>
  </React.StrictMode>
)
