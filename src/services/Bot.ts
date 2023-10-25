import axios from "axios";
import store from "../redux/store";
import { Configuration, OpenAIApi } from "openai";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const url = "https://api.openai.com/v1/chat/";

const configuration = new Configuration({
  organization: "org-kFTpamNmMlVzJInDJWT4jKSO",
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

// Define your function
function helloWorld(appendString: string) {
  const hello = "Hello World! " + appendString;
  return hello;
}

// Get the current time of day
function getTimeofDay() {
  console.log("Chamou a função getTimeOfDay().")
  let date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  let timeOfDay = "AM";
  if (hours > 12) {
    hours = hours - 12;
    timeOfDay = "PM";
  }

  return hours + ":" + minutes + ":" + seconds + " " + timeOfDay;
}

async function callChatGPTWithFunctions() {
  let messages: any = [
    {
      role: "system",
      content: "Execute as intruções do usuário",
    },
    {
      role: "user",
      content: "Olá, eu sou o usuário. Gostaria de saber as horas",
    }
  ]

  // Step 1: Call ChatGPT with te function name 
  let chat = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
    functions: [
      {
        name: "helloWorld",
        description: "Prints hello world with the string passed to it",
        parameters: {
          type: "object",
          properties: {
            appendString: {
              tpye: "string",
              description: "The string to append to the hello world message",
            }
          },
          require: ["appendString"],
        },
    },
    {
      name: "getTimeofDay",
      description: "Get the time of day.",
      parameters: {
        type: "object",
        properties: {
        },
        require: [],
      },
    }
  ],
    function_call: "auto",
  });

  let wantsToUseFunction = chat.data.choices[0].finish_reason === "function_call";
  let content = "";

  // Step 2: Check if ChatGPT wants to use a function 
  if (wantsToUseFunction) {
    // Step 3: Use ChatGPT arguments to call your function
    if (chat.data.choices[0].message?.function_call?.name === "helloWorld") {
      let argumentsObj = JSON.parse(chat.data.choices[0].message!.function_call!.arguments!);
      content = helloWorld(argumentsObj.appendString);
      messages.push(chat.data.choices[0].message);
      messages.push({
        role: "function",
        name: "helloWorld",
        content,
      });
      // console.log(messages);
    }
  }

  if (chat?.data?.choices?.[0]?.message?.function_call?.name === "getTimeofDay") {
    content = getTimeofDay();
    messages.push(chat.data.choices[0].message);
    messages.push({
      role: "function",
      name: "getTimeofDay",
      content,
    });
    // console.log(messages);
  }

  // Step 4: Call ChatGPT again with the function response
  let step4response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
  });
  console.log(step4response.data.choices[0]);

};

export const post = async (path: string, rq: any) => {

  const messages = store.getState().chat.messages.filter((item) => item.message);

  const allMessageIA = messages.reduce((acumulador, item) => {
    if (item.author === 'IA') {
      acumulador += item.message + '\n';
    }
    return acumulador;
  }, '');

  const allMessageUser = messages.reduce((acumulador, item) => {
    if (item.author === 'user') {
      acumulador += item.message + '\n';
    }
    return acumulador;
  }, '');

  try {
    const resp = await axios.post(
      url + path,
      {
        messages: [
          {
            role: "system",
            content:
              'Somos uma empresa chamada SmartWays que nasceu no início do ano de 2023 localizada em São Paulo. Você é um assistente virtual da SmartWays e existe para ajudar os clientes com as suas pendências e dúvidas. E para ajudar nossos clientes, temos regras a serem seguidas. A seguir estão listadas as regras: 1. Saudação: - Sempre que o cliente iniciar uma conversa com um comprimento, se apresente dizendo quem é e ofereça ao cliente como pode ajudá-lo; 2. Informações sobra a fatura: - Quando o cliente pedir informações sobre a fatura pergunte-o se ele quer informações da fatura detalhada ou se a fatura não chegou. Se o cliente querer informações sobre fatura detalhada, pergunte-o se ele já conhece o nosso vídeo explicativo sobre o assunto e na mesma mensagem dê ao cliente o link: "https://www.smartways.com.br/minha-fatura/entenda-sua-fatura" para ele acessar e saber como funciona. Caso o cliente dizer que a fatura não chegou, diga que não consegue tratar desse assunto no momento, mas dê ao cliente o link: "https://www.smartways.com.br/fatura-nao-chegou" para ele acessar e saber motivos pelo quão não chegou sua fatura; 3. Envio de comprovante: - Se o cliente dizer que já pagou sua fatura, dê a ele uma mensagem feliz que foi feito o pagamento. Também diga que nesse canal não é possível receber comprovantes, mas logo constará no sistema que foi realizdo o pagamento; 4. Dados cadastrais: - Todas as informações sobre os dados do cliente que o cliente queira saber ou mudar, diga que ele precisa ir no portal "https://www.smartways.com.br" e ir na opção "Meus Dados" no menu principal; 5. Procon: - Todo assunto que diz respeito a Proteção e Defesa do Consumidor que é o PROCON, o ideal é falar com o atendimento humano, e por isso peça ao cliente entrar em contato no telefone: "0794486"; 6. Mudar vencimento: - Quando o cliente querer mudar o vencimento, diga que é importante escolher a melhor data para realizar o pagamento da sua fatura. Dessa forma evita atrasos e juros. Também diga que é possível realizar a mudança de vencimento no portal da SmartWays não aqui nesse canal. Mas para que mude o vencimento, precisa necessariamente ter um pagamento em aberto; 7. Fraude: - Se em algum momento o cliente insinuar que algo é fraude, ou seja, se o cliente dizer que algo não consta como deveria ser, diga que é uma pena que isso tenha acontecido. Peça que o cliente entre em contato no telefone: "0794486". Também dê ao cliente o link da central de atendimento "https://www.smartways.com.br/central-atendimento"; 8. Débito automático: - Se em algum momento o cliente falar sobre débito automático, diga que essa opção está disponível no nosso Portal de negociação e para fazer isso, acesse em nosso site: "https://www.smartways.com.br", vá na opção "alterar forma de pagamento" e depois vá em "Débito em conta corrente". Diga também para o cliente não se esquecer de habilitar esse débito automático no seu banco também; 9. Cancelamento: - Sempre que o cliente pedir cancelamento de nossos serviços, como já temos os dados do cliente pergunte a ele se ele tem certeza do cancelamento. Se a respostar for sim então cancele o serviço e informe que o cancelamento foi sucedido, caso a resposta for não, então agradeça-o e pergunte no que ainda pode ajudar; 10. Falecimento: - Caso em algum momento o cliente diga algo sobre o falecimento de alguém, pergunte-o se deseja informar o falecimento do titular, caso a resposta for não, pergunte no que ainda poder ajudar, caso for sim, de a sugestão de uma proposta em isentar o débito atual e trasferir a assinatura para o cliente. Diga que realizando isso conseguimos zerar a dívida vinculada a ele e ainda garantimos que a assinatura permaneça ativa. Em seguida, pergunte se o cliente tem interesse em trasferir a assinatura. Caso ele aceite, recomende que ele entre em contato com nossos especialistas atráves do telefone: "0794486". Caso não aceite a proposta, pergunte no que ainda pode ajudar; 11. Criticas: - Se o cliente não está satisfeito com o atendimento ou algo não esteja como deseja, diga a ele que sentimos muito por não conseguir ajudá-lo mas sugira a ele outros canais de atendimento como a nossa central de atendimento "https://www.smartways.com.br/central-atendimento"; 12. Problemas técnicos: - Se o cliente solicitar ajuda em assuntos de suporte técnico, agenda de visitas ou algum outro problema técnico, diga que esse canal que estamos falando não consegue auxiliá-lo nesses assuntos, mas sugira que ele entre em contato com a nossa central de atendimento "https://www.smartways.com.br/central-atendimento"; 13. Código do cliente: - Se em algum momento o cliente solicitar seu código de cliente, gere uma sequência aleatória de 14 caracteres com números e letras para o cliente mas não diga a ele como é gerado esse código. Você não precisa de informações do cliente pra gerar o código, apenas gere uma sequência aleatória. Esse código é gerado uma única vez então caso o cliente solicite mudança ou peça novamente o código, você simplesmente forneça o código já gerado anteriormente; 14. Central de atendimento: - Caso o cliente solicite o número de atendimento ao cliente, dê a ele o nosso link central de atendimento "https://www.smartways.com.br/central-atendimento"; ou ligar no número "0794486"; 15. Finalização: - Quando as dúvidas do cliente já forem satisfeitas, pergunte a ele no que ainda pode ajudar. Caso não tiver mais no que ajudar, agradeça pelo contato com a SmartWays e finalize o atendimento. OBSERVAÇÕES: - Em todo momento da conversa, sempre converse com o cliente com empatia, de forma didática; - Entenda as dores do clientes e seus problemas. Procure não deixar o cliente com mais dúvidas; - Pode utilizar alguns emojis na conversa, mas não muitos para não poluir; - Não passe informações que não contenha nessas regras, mas tente sempre auxiliar o cliente com o possível de acordo com a regra de negócio; - Entenda as intenções do que o cliente está dizendo, se caso houver gírias ou palavras abreviadas, entenda o que o cliente está tentando dizer;',
          },
          { role: "user", content: allMessageUser },
          { role: "assistant", content: allMessageIA },
        ],
        model: "gpt-3.5-turbo",
        max_tokens: 500,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    return resp.data;
  } catch (e: any) {
    console.log("Houve um erro ao realizar a requisição POST", e);
  }
};

export const Bot = {
  post,
};

// callChatGPTWithFunctions();