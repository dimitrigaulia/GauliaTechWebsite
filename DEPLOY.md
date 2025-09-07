# Deploy da Gaulia Tech

Este projeto está configurado para deploy como site estático (SSG) em várias plataformas CDN.

## Configurações Implementadas

### ✅ SSG (Static Site Generation)
- Prerender configurado para todas as rotas principais
- Build otimizado para produção
- Sem necessidade de servidor Node.js

### ✅ SEO Otimizado
- Meta tags dinâmicas por rota
- Open Graph e Twitter Cards
- Schema.org JSON-LD
- Sitemap.xml e robots.txt

### ✅ Performance
- Lazy loading de componentes
- Otimização de bundle
- Cache headers configurados
- Compressão ativada

## Deploy em Diferentes Plataformas

### Vercel
```bash
npm run build:prod
# Deploy automático via GitHub ou CLI
```

### Netlify
```bash
npm run build:prod
# Deploy via drag & drop da pasta dist/gaulia-tech/browser
# ou conectar repositório GitHub
```

### Cloudflare Pages
```bash
npm run build:prod
# Deploy via GitHub ou CLI
```

### GitHub Pages
```bash
npm run build:prod
# Usar GitHub Actions para deploy automático
```

## Scripts Disponíveis

- `npm run build:prod` - Build otimizado para produção
- `npm run build:prerender` - Build com prerender (SSG)
- `npm start` - Servidor de desenvolvimento

## Estrutura de Arquivos de Deploy

- `vercel.json` - Configuração para Vercel
- `netlify.toml` - Configuração para Netlify
- `_headers` - Headers para Cloudflare Pages
- `public/_redirects` - Redirects para Netlify

## Formulário de Contato

Para o formulário de contato funcionar, você precisará:

1. **Netlify Functions**: Criar função serverless
2. **Vercel Functions**: Usar API Routes
3. **Cloudflare Workers**: Implementar worker
4. **Serviço externo**: Formspree, Netlify Forms, etc.

## Monitoramento

Após o deploy, configure:
- Google Analytics
- Google Search Console
- Monitoramento de performance (Core Web Vitals)
