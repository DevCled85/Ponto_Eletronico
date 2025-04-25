import { Component } from 'react';

class ErrorBoundary extends Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return <h1>Algo deu errado. Por favor, recarregue a página.</h1>;
        }
        return this.props.children;
    }
}

export default ErrorBoundary; 