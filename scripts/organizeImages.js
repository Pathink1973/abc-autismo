import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define categories and their associated keywords/rules
const categoryRules = {
  actions: [
    'andar', 'correr', 'saltar', 'comer', 'beber', 'dormir', 'brincar',
    'estudar', 'ler', 'escrever', 'pintar', 'desenhar', 'dançar', 'cantar',
    'nadar', 'jogar', 'sentar', 'levantar', 'lavar', 'vestir', 'abraçar',
    'tomar banho', 'tomar', 'banho'
  ],
  animals: [
    'cão', 'gato', 'pássaro', 'peixe', 'coelho', 'cavalo', 'vaca',
    'porco', 'galinha', 'pato', 'ovelha', 'macaco', 'leão', 'tigre',
    'elefante', 'girafa', 'zebra', 'urso', 'rato', 'cobra'
  ],
  body: [
    'cabeça', 'olhos', 'olho', 'nariz', 'boca', 'orelhas', 'orelha', 'cabelo',
    'pescoço', 'ombros', 'ombro', 'braços', 'mãos', 'mão', 'dedos', 'barriga',
    'pernas', 'pés', 'pé', 'joelhos', 'joelho', 'costas', 'dentes', 'língua',
    'unhas', 'sobrancelhas', 'cotovelo', 'escova de dentes'
  ],
  clothes: [
    'camisa', 'calças', 'calças', 'vestido', 'sapatos', 'meias', 'casaco',
    'chapéu', 'luvas', 'cachecol', 'pijama', 'camisola', 'saia',
    'shorts', 'botas', 'bota', 'sandálias', 'sapatilha'
  ],
  colors: [
    'vermelho', 'azul', 'amarelo', 'verde', 'roxo', 'laranja',
    'rosa', 'marrom', 'preto', 'branco', 'cinza', 'dourado',
    'prateado', 'bege', 'turquesa', 'castanho'
  ],
  emotions: [
    'feliz', 'triste', 'zangado', 'assustado', 'surpreso', 'cansado',
    'entediado', 'confuso', 'envergonhado', 'orgulhoso', 'ansioso',
    'calmo', 'animado', 'preocupado', 'otimista', 'doente'
  ],
  food: [
    'pão', 'arroz', 'massa', 'carne', 'peixe', 'frango', 'sopa',
    'salada', 'fruta', 'legumes', 'leite', 'queijo', 'ovos', 'água',
    'sumo', 'café', 'chá', 'bolo', 'chocolate', 'gelado', 'banana',
    'maça', 'pera', 'cerejas', 'donut', 'gomas', 'hamburguer', 'iogurte',
    'manteiga', 'pizza', 'torrada', 'bitoque', 'bolacha', 'coca-cola'
  ],
  general: [
    'sim', 'não', 'olá', 'adeus', 'obrigado', 'por favor', 'desculpa',
    'bom dia', 'boa tarde', 'boa noite', 'ajuda', 'parar', 'começar',
    'eu', 'gosto'
  ],
  numbers: [
    'zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete',
    'oito', 'nove', 'dez', 'onze', 'doze', 'treze', 'catorze', 'quinze',
    'dezesseis', 'dezessete', 'dezoito', 'dezenove', 'vinte',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'mais', 'menos', 'igual', 'vezes'
  ],
  objects: [
    'mesa', 'cadeira', 'cama', 'porta', 'janela', 'televisão', 'computador',
    'telefone', 'telemóvel', 'livro', 'lápis', 'caneta', 'papel', 'tesoura',
    'brinquedo', 'bola', 'relógio', 'chaves', 'óculos', 'guarda-chuva',
    'caneca', 'carro', 'bicicleta', 'bloco de notas', 'cola', 'colher',
    'garfo', 'prato', 'pente', 'pincel', 'rágua', 'sabonete', 'toalha',
    'cotonete', 'escova', 'lego', 'mochila', 'banda desenhada'
  ],
  places: [
    'casa', 'escola', 'parque', 'hospital', 'loja', 'restaurante',
    'praia', 'jardim', 'rua', 'cidade', 'campo', 'montanha', 'rio',
    'mar', 'zoo', 'cinema', 'biblioteca', 'museu', 'padaria', 'oficina',
    'mercado', 'quarto de banho', 'pastelaria', 'piscina', 'barbeiro',
    'farmácia'
  ],
  weather: [
    'sol', 'chuva', 'nuvem', 'vento', 'neve', 'trovoada', 'nublado',
    'quente', 'frio', 'tempestade', 'arco-íris', 'geada', 'neblina'
  ]
};

// Create category directories if they don't exist
async function createCategoryDirectories(baseDir) {
  await Promise.all(Object.keys(categoryRules).map(category => {
    const dir = path.join(baseDir, category);
    return fs.mkdir(dir, { recursive: true });
  }));
}

// Determine category based on filename
function determineCategory(filename) {
  const name = filename.toLowerCase().replace(/[^a-zA-Z0-9áéíóúâêîôûãõàèìòùç]/g, ' ');
  
  // Special cases first
  if (/^[0-9]+\./.test(filename) || ['mais', 'menos', 'igual', 'vezes'].some(op => name.includes(op))) {
    return 'numbers';
  }
  
  for (const [category, keywords] of Object.entries(categoryRules)) {
    if (keywords.some(keyword => name.includes(keyword.toLowerCase()))) {
      return category;
    }
  }
  
  return 'general';
}

// Get all image files recursively from a directory
async function getAllImageFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'unsorted' || entry.name === '.git') {
        return [];
      }
      return getAllImageFiles(fullPath);
    } else if (/\.(jpg|jpeg|png|webp|gif)$/i.test(entry.name)) {
      return [[fullPath, entry.name]];
    }
    return [];
  }));
  
  return files.flat();
}

// Main function to organize images
async function organizeImages(sourceDir, targetDir) {
  try {
    // Create category directories
    await createCategoryDirectories(targetDir);

    // Get all image files recursively
    const imageFiles = await getAllImageFiles(sourceDir);
    console.log(`Found ${imageFiles.length} images to organize`);

    // Create temporary directory for organization
    const tempDir = path.join(targetDir, '_temp_organization');
    await fs.mkdir(tempDir, { recursive: true });

    // Move all images to temp directory first
    for (const [fullPath, filename] of imageFiles) {
      if (fullPath.includes('_temp_organization')) continue;
      
      const tempPath = path.join(tempDir, filename);
      try {
        await fs.rename(fullPath, tempPath);
        console.log(`Moved ${filename} to temp directory`);
      } catch (error) {
        console.error(`Error moving ${filename} to temp: ${error.message}`);
      }
    }

    // Now organize from temp directory
    const tempFiles = await fs.readdir(tempDir);
    for (const file of tempFiles) {
      const sourcePath = path.join(tempDir, file);
      const category = determineCategory(file);
      const targetPath = path.join(targetDir, category, file);
      
      try {
        await fs.rename(sourcePath, targetPath);
        console.log(`Organized ${file} into ${category} category`);
      } catch (error) {
        console.error(`Error organizing ${file}: ${error.message}`);
      }
    }

    // Remove temp directory
    try {
      await fs.rmdir(tempDir);
    } catch (error) {
      console.error('Error removing temp directory:', error);
    }

  } catch (error) {
    console.error('Error organizing images:', error);
  }
}

// Directory paths
const imagesDir = path.join(__dirname, '..', 'public', 'images');

// Main execution
async function main() {
  try {
    console.log('Starting image organization...');
    await organizeImages(imagesDir, imagesDir);
    console.log('Image organization complete!');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
