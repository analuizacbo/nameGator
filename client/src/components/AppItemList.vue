<template>
    <div>
        <h5>
            {{ title }} <span class="badge rounded-pill text-bg-primary">{{ items.length }}</span>
        </h5>
        <div class="card">
            <div class="card-body">
                <ul class="list-group">
                    <li class="list-group-item" v-for="item in items" v-bind:key="item.id">
                        <div class="row">
                            <div class="col-md">
                                {{ item.description }}
                            </div>
                            <div class="col-md text-end">
                                <button class="btn btn-info" v-on:click="deleteItem(item)">
                                    <span class="fa fa-trash" />
                                </button>
                            </div>
                        </div>
                    </li>
                </ul>
                <br />
                <div class="input-group">
                    <!-- Aqui é criada uma variavel local com a info do input-->
                    <!-- {{ item }} -->
                    <input class="form-control" type="text" placeholder="Digite o item" v-model="description"
                        v-on:keyup.enter="addItem(type, description)" />
                    <div class="input-group-append">
                        <button class="btn btn-info" v-on:click="addItem(type, description)">
                            <span class="fa fa-plus" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AppItemList',
    props: ["title", "type", "items"],
    data() {
        return {
            description: ""
        }
    },
    methods: {
        addItem(type, description) {
            this.$emit("addItem", {
                type,
                description
            });
            this.description = ""
        },
        deleteItem(item) {
            this.$emit("deleteItem", item)
            this.item = "";
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
