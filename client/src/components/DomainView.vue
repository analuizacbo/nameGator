<template>
    <div>
        <div class="container">
            <router-link :to="{ name: 'domains' }">Voltar</router-link>
            <br />
            <div class="text-left">
                {{ domain }}
            </div>
            <div class="card">
                <div class="card-body">
                    <li class="list-group" v-for="domain in domains" v-bind:key="domain.extension">
                        <ul class="list-group-item">
                            <div class="row">
                                <div class="col-md-6">
                                    {{ domain.extension }}
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
                                </div>
                            </div>
                        </ul>
                    </li>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import axios from "axios/dist/axios";

export default {
    //Para mandar par props e necessario ativar a prop da rota(main.js)
    props: ["domain"],
    data() {
        return {
            domains: [],
        }
    },
    // created() {
    //     console.log(this.$route.params);
    //     this.domain = this.$route.params.domain;
    // }
    created() {
        //console.log('Entrou')
        axios({
            url: "http://localhost:8000",
            method: "post",
            data: {
                query: `
                    mutation ($name : String) {
                        domains : generateAnotherDomain (name : $name){
                            name
                            extension
                            link
                            available
                        }
                    }
                `,
                variables: {
                    name: this.domain
                }
            }
        }).then(response => {
            //console.log(response);
            const query = response.data
            this.domains = query.data.domains;
        })
    }
}
</script>