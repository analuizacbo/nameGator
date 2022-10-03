<template>
    <div>
        <div id="main">
            <div class="container">
                <div class="row">
                    <div class="col-md">
                        <AppItemList title="Prefixos" type="prefix" v-bind:items="items.prefix" v-on:addItem="addItem"
                            v-on:deleteItem="deleteItem" />
                    </div>
                    <div class="col-md">
                        <AppItemList title="Sufixos" type="sufix" v-bind:items="items.sufix" v-on:addItem="addItem"
                            v-on:deleteItem="deleteItem" />
                    </div>
                </div>
                <br />
                <h5>
                    Domínios <span class="badge rounded-pill text-bg-primary">{{ domains.length }}</span>
                </h5>
                <div class="card">
                    <div class="card-body">
                        <li class="list-group" v-for="domain in domains" v-bind:key="domain.name">
                            <ul class="list-group-item">
                                <div class="row">
                                    <div class="col-md-6">
                                        {{ domain.name }}
                                    </div>
                                    <div class="col-md-3">
                                        <span class="badge rounded-pill text-bg-primary">{{ (domain.available) ?
                                                "Disponível" : "Indisponível"
                                        }}</span>
                                    </div>
                                    <div class="col-md-3 text-end">
                                        <a class="btn btn-success" v-bind:href="domain.link" target="_blank">
                                            <span class="fa fa-shopping-cart" />
                                        </a>
                                        &nbsp;
                                        <button class="btn btn-info" @click="openDomain(domain)">
                                            <span class="fa fa-search" />
                                        </button>
                                    </div>
                                </div>
                            </ul>
                        </li>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>

import axios from "axios/dist/axios";
import AppItemList from "./AppItemList.vue";


export default {
    name: "App",
    components: {
        AppItemList,
    },
    data: function () {
        return {
            items: {
                prefix: [],
                sufix: [],
            },
            domains: [],
        };
    },
    methods: {
        addItem(item) {
            //this.prefixes.push(prefix);
            axios({
                url: "http://localhost:8000",
                method: "post",
                data: {
                    query: `
                        mutation ($item : ItemInput) {
                            newItem : saveItem(item : $item){
                                id
                                type
                                description
                            }
                        }
                    `,
                    variables: {
                        item
                    }
                }
            }).then(response => {
                //console.log(response)
                const query = response.data;
                const newItem = query.data.newItem;
                this.items[item.type].push(newItem);
                this.generateDomains()
            })
        },

        deleteItem(item) {
            // this.prefixes.splice(this.prefixes.indexOf(prefix), 1);
            axios({
                url: "http://localhost:8000",
                method: "post",
                data: {
                    query: `
                    mutation ($id : Int) {
                        deletedItem: deleteItem(id: $id)
                    }`,
                    variables: {
                        id: item.id
                    },
                },
            }).then(() => {
                this.items[item.type].splice(this.items[item.type].indexOf(item), 1)
                this.generateDomains();
            });
        },
        getItems(type) {
            return axios({
                url: "http://localhost:8000",
                method: "post",
                data: {
                    query: `
                    query ($type : String )
                    {
                        items : items (type : $type)
                        {
                            id
                            type 
                            description
                        }
                    }
                `,
                    variables: {
                        type
                    }
                }
            }).then(response => {
                //console.log(response)
                const query = response.data;
                this.items[type] = query.data.items;
                //console.log(query.data)
            });
        },
        generateDomains() {
            axios({
                url: "http://localhost:8000",
                method: "post",
                data: {
                    query: `
                        mutation {
                            domains : generateDomains {
                                name
                                link
                                available
                            }
                        }
                    `
                }
            }).then((response) => {
                const query = response.data;
                //console.log(query);
                this.domains = query.data.domains;
            });
        },
        openDomain(domain) {
            this.$router.push({
                path: `/domains/${domain.name}`,
            })
        },
    },
    created() {
        //console.log('created');
        Promise.all([
            this.getItems("prefix"),
            this.getItems("sufix"),
        ]).then(() => {
            this.generateDomains();
        });
    }
};
</script>
  
<style>
</style>
  