const nomes = [
    "Ana", "João", "Maria", "Pedro", "Camila", "Lucas", "Gabriela", "Rafael", "Júlia", "Fernando",
    "Isabela", "Bruno", "Larissa", "Matheus", "Clara", "Thiago", "Letícia", "Gustavo", "Mariana", "Felipe",
    "Beatriz", "André", "Sophia", "Ricardo", "Laura", "Eduardo", "Luana", "Victor", "Carolina", "Henrique",
    "Daniela", "Carlos", "Bianca", "Diego", "Renata", "Caio", "Patrícia", "Vinícius", "Aline", "Samuel",
    "Fernanda", "Antônio", "Natália", "José", "Débora", "Paulo", "Alessandra", "Leandro", "Manuela", "Rodrigo",
    "Amanda", "Alexandre", "Nicole", "Francisco", "Bruna", "Wesley", "Viviane", "Mário", "Rafaela", "Danilo",
    "Carla", "Igor", "Tainá", "Cristiano", "Tatiane", "Jorge", "Letícia", "Renan", "Vanessa", "Marcelo",
    "Sandra", "Maurício", "Daniel", "Elisa", "Augusto", "Tatiana", "Fabiano", "Helena", "Fábio", "Stella",
    "Miguel", "Juliana", "César", "Verônica", "Nathan", "Mônica", "Alan", "Evelyn", "Eduarda", "Rogério",
    "Lorena", "Felipe", "Iara", "Otávio", "Adriana", "Brenda", "Luciano", "Flávia", "Hugo", "Érica",
    "Wellington", "Marina", "Sebastião", "Cristiane", "Gilberto", "Talita", "Edson", "Tereza", "Luan", "Kátia",
    "Estevão", "Jéssica", "Raul", "Isabel", "Renato", "Melina", "Alfredo", "Michele", "Cauã", "Alice",
    "Augusto", "Vera", "Maurício", "Giovana", "Emanuel", "Ingrid", "Enzo", "Marli", "Levi", "Thais",
    "Mateus", "Paula", "Josué", "Luiza", "Rui", "Isadora", "Danilo", "Cláudia", "Caio", "Regina",
    "Elias", "Maristela", "Noah", "Bárbara", "Otávio", "Malu", "Anderson", "Ana Clara", "Ewerton", "Cristina",
    "Lázaro", "Eva", "Ciro", "Milena", "Joaquim", "Fabíola", "Davi", "Lorena", "Salvador", "Tássia",
    "Léo", "Olívia", "Everton", "Marcela", "Breno", "Roberta", "Eurico", "Pietra", "Sandro", "Adriana",
    "Rômulo", "Janaina", "Almir", "Emília", "Cássio", "Mara", "Benjamin", "Emanuelle", "Frederico", "Carine",
    "André", "Rayssa", "Flávio", "Clarice", "Ruan", "Amélia", "Osvaldo", "Cecília", "Alberto", "Diana",
    "Vicente", "Esther", "Edmilson", "Irene", "Fernando", "Raissa", "Joana", "Gabriel", "Ester", "Luiz",
    "Sueli", "Paulo", "Clarissa", "Eder", "Lídia", "Reinaldo", "Natasha", "Túlio", "Marilene", "Arthur",
    "Joice", "Alex", "Ivy", "Ramon", "Lia", "Jonas", "Rute", "Erick", "Charlene", "Arnaldo",
    "Priscila", "Silvio", "Vânia", "Rafael", "Andressa", "Márcio", "Gláucia", "Carlos Eduardo", "Marluce", "Thiago",
    "Patrícia", "Gustavo", "Rosana", "Vicente", "Laís", "Felipe", "Luara", "Denis", "Joan", "Robson",
    "Viviane", "Flora", "Edu", "Bianca", "Saulo", "Alana", "Álvaro", "Julieta", "Fernando", "Livia",
    "Guilherme", "Nina", "Oséias", "Estela", "Emerson", "Lara", "Jonas", "Tânia", "Matheus", "Gisele",
    "Isaque", "Márcia", "Augusto", "Pamela", "Josias", "Valentina", "Júnior", "Karla", "Eliseu", "Lorraine",
    "Jeferson", "Isis", "Moisés", "Daniela", "Helder", "Cristiana", "Samuel", "Beatriz", "Ícaro", "Iolanda",
    "Edgar", "Dalva", "Aarão", "Clarice", "Leandro", "Maria Eduarda", "Nélson", "Eliana", "Diogo", "Miriam"
]; // 290

const sobrenomes = [
    "Silva", "Santos", "Oliveira", "Souza", "Lima", "Pereira", "Ferreira", "Alves", "Gomes", "Ribeiro",
    "Carvalho", "Almeida", "Costa", "Araújo", "Martins", "Rocha", "Barbosa", "Vieira", "Moreira", "Nascimento",
    "Cardoso", "Santana", "Correia", "Ramos", "Monteiro", "Melo", "Teixeira", "Fonseca", "Fernandes", "Rodrigues",
    "Cunha", "Dias", "Lopes", "Machado", "Leite", "Batista", "Castro", "Campos", "Morais", "Farias",
    "Borges", "Nogueira", "Araújo", "Moura", "Azevedo", "Sousa", "Barros", "Siqueira", "Bezerra", "Coelho",
    "Andrade", "Pinheiro", "Pires", "Prado", "Barreto", "Cavalcanti", "Xavier", "Mendes", "Reis", "Amaral",
    "Antunes", "Aguiar", "Chaves", "Freitas", "Assis", "Bueno", "Rangel", "Queiroz", "Peixoto", "Braga",
    "Viana", "Nunes", "Brito", "Macedo", "Ferraz", "Cruz", "Figueiredo", "Simões", "Brandão", "Duarte",
    "Franco", "Tavares", "Campos", "Guimarães", "Pontes", "Lacerda", "Valente", "Pimentel", "Rezende", "Moraes",
    "Serra", "Maia", "Quintana", "Furtado", "Henriques", "Miranda", "Garcia", "Severino", "César", "Menezes",
    "Barros", "Bernardo", "Sarmento", "Alencar", "Cabral", "Veloso", "Luz", "Sales", "Vasconcelos", "Toledo",
    "Pacheco", "Alvarenga", "Goulart", "Rios", "Neves", "Sampaio", "Junqueira", "Salazar", "Damasceno", "Aragão",
    "César", "Parente", "Benites", "Muniz", "Lins", "Teles", "Montenegro", "Mascarenhas", "Carneiro", "Castanho",
    "Borba", "Pinto", "Nóbrega", "Amorim", "Barcellos", "Colares", "Coutinho", "Quirino", "Veiga", "Fagundes",
    "Leal", "Travassos", "Fonseca", "Gusmão", "Pessanha", "Leme", "Arruda", "Galvão", "Torre", "Gaioso",
    "Diniz", "Varela", "Camargo", "Roriz", "Figueira", "Prates"
]; // 156

// Função para gerar numero aleatorio;
const aleatNumber = (arr) => Math.floor(Math.random() * arr.length)

// Função para gerar os nomes
const namesFull = () => {
    const nome = nomes[aleatNumber(nomes)];
    const sobreNome = sobrenomes[aleatNumber(sobrenomes)];
    return `${nome} ${sobreNome}`;
}


// Exemplo de uso: gerar 10 nomes completos
// for (let i = 0; i < 10; i++) {
//     console.log(namesFull());
// }


export default { namesFull };