// test_swagger.ts
import swaggerJSDoc from 'swagger-jsdoc';
// Não é necessário importar 'path' explicitamente se __dirname e path.resolve forem tratados pelo Node.js
// Mas para TypeScript, se você não tem @types/node instalado globalmente ou em seu tsconfig.json,
// ele pode reclamar. Vamos garantir que @types/node está instalado.

// Certifique-se que o pacote @types/node está instalado: npm install @types/node --save-dev
// Se não estiver, tsconfig.json pode precisar de "typeRoots": ["./node_modules/@types"]

const testOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Test API', version: '1.0.0' },
    // ✅ CORREÇÃO: 'apis' deve estar no mesmo nível que 'info'
    apis: ['./src/routes/*.ts'], // Caminho relativo a ONDE VOCÊ EXECUTA o 'npx ts-node'
  },
};

try {
  console.log('Tentando gerar docs Swagger...');
  console.log('Opções APIS configuradas:', testOptions.definition.apis); // Para depuração
  const testDocs = swaggerJSDoc(testOptions);
  console.log('Swagger JSDoc gerado com sucesso para teste!');
  // console.log(JSON.stringify(testDocs, null, 2));
} catch (error: any) {
  console.error('Erro ao gerar Swagger JSDoc de teste:', error.message);
}