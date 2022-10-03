const { ApolloServer } = require("apollo-server");
const dns = require("dns");

const typeDefs = `
    type Item {
        id: Int
        type: String
        description: String
    }

    type Domain {
        name : String
        extension : String
        link : String
        available : Boolean
    }

    type Query {
        items (type : String) : [Item]
    }

    input ItemInput {
        type: String
        description : String
    }

    type Mutation {
        saveItem ( item: ItemInput) : Item
        deleteItem (id: Int) : Boolean
        generateDomains : [Domain]
        generateAnotherDomain ( name : String): [Domain] 
    }
    
`;

const items = [
    { id: 1, type: "prefix", description: "Air" },
    { id: 2, type: "prefix", description: "Jet" },
    { id: 3, type: "prefix", description: "Flight" },
    { id: 4, type: "sufix", description: "Hub" },
    { id: 5, type: "sufix", description: "Station" },
    { id: 6, type: "sufix", description: "Mart" },
];

const isDomainAvalaible = function (url) {
    return new Promise(function (resolve, reject) {
        dns.resolve(url, function (error) {
            if (error) {
                //console.log('if')
                resolve(true);
            } else {
                //console.log('else')
                resolve(false);
            }
        });
    });
};

const resolvers = {
    Query: {
        items(_, args) {
            //console.log(args)
            return items.filter(item => item.type === args.type);
        },
    },

    Mutation: {
        saveItem(_, args) {
            //console.log(args);
            const item = args.item;
            //Criando um id dinamicamente
            item.id = Math.floor(Math.random() * 1000);
            items.push(item);
            return item;
        },
        deleteItem(_, args) {
            //console.log(args);
            const id = args.id;
            const item = items.find(item => item.id === id);
            //console.log(item)
            if (!item) return false;
            items.splice(items.indexOf(item), 1)
            return true;
        },
        async generateDomains() {
            const domains = [];
            for (const prefix of items.filter(item => item.type === "prefix")) {
                for (const sufix of items.filter(item => item.type === "sufix")) {
                    const name = prefix.description + sufix.description;
                    const url = name.toLocaleLowerCase();
                    const link = `https://checkout.hostgator.com.br/?a=add&sld=${url}&tld=.com.br`
                    const available = await isDomainAvalaible(`${url}.com.br`);
                    //console.log(available)
                    domains.push({
                        name,
                        link,
                        available
                    });
                }
            }
            //console.log(domains);
            return domains;
        },
        async generateAnotherDomain(_, args) {
            const name = args.name;
            const extensions = [".com.br", ".com", ".net", ".org"];
            const domains = [];
            for (const extension of extensions) {
                const url = name.toLocaleLowerCase();
                const link = `https://checkout.hostgator.com.br/?a=add&sld=${url}&tld=${extension}`;
                const available = await isDomainAvalaible(`${url}${extension}`);
                //console.log(available)
                domains.push({
                    name,
                    extension,
                    link,
                    available
                });
            }
            return domains;
        }

    }
}

const server = new ApolloServer({ typeDefs, resolvers });

//console.log(ApolloServer)
server.listen(8000).then(({ url }) => {
    console.log(`Server running at ${url}`)
});