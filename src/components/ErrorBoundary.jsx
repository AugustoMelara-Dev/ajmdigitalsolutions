// --- FILE: src/components/ErrorBoundary.jsx ---
// Debe ser un Client Component para poder capturar errores en React.
'use client';

import React from 'react';

/**
 * ErrorBoundary de producción:
 * - Acepta fallback como nodo o función (error) => nodo
 * - onError, onReset, resetKeys (al estilo react-error-boundary)
 * - Opción reloadOnReset para forzar recarga
 * - Accesible (role="alert", foco gestionado)
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    this.alertRef = React.createRef();
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Reporte a consola y callback opcional
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
    if (typeof this.props.onError === 'function') {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Reset cuando cambian las resetKeys
    const { resetKeys } = this.props;
    if (this.state.hasError && Array.isArray(resetKeys) && Array.isArray(prevProps.resetKeys)) {
      const changed =
        resetKeys.length !== prevProps.resetKeys.length ||
        resetKeys.some((item, i) => Object.is(item, prevProps.resetKeys[i]) === false);
      if (changed) {
        this.resetBoundary();
      }
    }

    // Llevar foco al contenedor del error cuando aparezca
    if (!prevState.hasError && this.state.hasError && this.alertRef.current) {
      try {
        this.alertRef.current.focus({ preventScroll: true });
      } catch {}
    }
  }

  resetBoundary = () => {
    this.setState({ hasError: false, error: null });
    if (typeof this.props.onReset === 'function') this.props.onReset();
    if (this.props.reloadOnReset && typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  renderDefaultFallback(error) {
    const isDev = process.env.NODE_ENV !== 'production';

    return (
      <div
        ref={this.alertRef}
        role="alert"
        tabIndex={-1}
        className="w-[92%] max-w-md mx-auto my-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-card text-center"
      >
        <h2 className="text-lg font-semibold text-slate-900">Algo salió mal</h2>
        <p className="mt-2 text-sm text-slate-600">
          Hemos registrado el incidente. Puedes intentar de nuevo.
        </p>

        {isDev && error && (
          <details className="mt-3 text-left text-xs text-slate-500 bg-slate-50 rounded p-3 border border-slate-200">
            <summary className="cursor-pointer font-medium">Detalles (solo desarrollo)</summary>
            <pre className="mt-2 whitespace-pre-wrap">{String(error.stack || error.message)}</pre>
          </details>
        )}

        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={this.resetBoundary}
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl font-semibold bg-slate-900 text-white hover:opacity-90"
          >
            Intentar de nuevo
          </button>
          <a
            href="#inicio"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl font-semibold border border-slate-200 text-slate-900 hover:bg-slate-50"
          >
            Ir al inicio
          </a>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      const { fallback } = this.props;
      const error = this.state.error || new Error('Unknown error');

      if (typeof fallback === 'function') {
        try {
          return fallback(error);
        } catch {
          // Si el fallback personalizado falla, usamos el fallback por defecto
          return this.renderDefaultFallback(error);
        }
      }

      if (fallback) return fallback;

      return this.renderDefaultFallback(error);
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
