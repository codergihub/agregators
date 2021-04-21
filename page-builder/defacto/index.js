const fs = require('fs');

const catPage = {
  htmlOutput: 'page-build/tr/moda/defacto/kadin/jean/jean-kategoriler.html',
  component: 'src/csr-components/products-nav.js',
  json: './jean-kategoriler.json'
};

function defactoPageBuilder() {
  const filePath = `${process.cwd()}/page-build/tr/moda/defacto/kadin/jean/jean-kategoriler.json`;
  const data = fs.readFileSync(filePath, 'utf-8');

  const pages = JSON.parse(data).map(p => {
    const { productName } = p;
    const lowerCaseProdName = productName.toLowerCase();
    return {
      htmlOutput: `page-build/tr/moda/defacto/kadin/jean/${lowerCaseProdName}.html`,
      component: 'src/csr-components/product-list/product-list.js',
      json: `./${lowerCaseProdName}.json`,
      marka: 'defacto'
    };
  });

  return [...pages, catPage];
}

module.exports = {
  defactoPageBuilder
};
