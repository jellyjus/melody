<template>
    <div>
        <Row>
            <Col span="12">
                <Breadcrumb>
                    <BreadcrumbItem to="/playlists">
                        <Icon type="ios-home-outline"></Icon> Плейлисты
                    </BreadcrumbItem>
                    <BreadcrumbItem to="/playlists/add_playlist">
                        <Icon type="social-buffer-outline"></Icon> Создать
                    </BreadcrumbItem>
                </Breadcrumb>
            </Col>
        </Row>
        <Row style="margin-top: 30px">
            <Col span="16">
                <Form ref="form" :model="form" :rules="formRules" inline class="form">
                    <FormItem prop="name">
                        <Input v-model="form.name" placeholder="Имя плейлиста" style="width: 300px"></Input>
                    </FormItem>
                    <FormItem prop="tracks">
                        <Button type="primary" class="add-playlist-button" @click="addPlaylist">Создать</Button>
                    </FormItem>
                </Form>

            </Col>
            <Col span="8" class="added-tracks-count">
                Добавлено {{tracksCount}} трек(ов)
            </Col>
        </Row>
        <Row type="flex" style="margin-top: 20px">
            <Album v-for="album in albums" :data="album" :key="album.id"></Album>
        </Row>
    </div>
</template>

<script>
    import Album from "./Album";
    export default {
        name: "AddPlaylist",
        components: {Album},
        data() {
            const validateTracks = (rule, value, callback) => {
                if (this.tracksCount < 1) {
                    return callback(new Error('Добавьте минимум 10 треков'));
                }
                callback();
            };

            return {
                form: {
                    name: null,
                },
                formRules: {
                    name: [
                        { required: true, message: 'Введите название плейлиста', trigger: 'blur' }
                    ],
                    tracks: [
                        { validator: validateTracks, trigger: 'blur' }
                    ]
                },
                albums: []
            }
        },
        created() {
            this.$socket.emit("getAlbums", null, (data) => {
                this.albums = data.response.items
            })
        },
        methods: {
            addPlaylist() {
                this.$refs['form'].validate((valid) => {
                    if (!valid)
                        return;
                    const data = {
                        name: this.form.name,
                        tracks: this.$store.state.addedTracks
                    };
                    this.$socket.emit('addPlaylist', data, (res) => {
                        console.log(res)
                    })
                })
            }
        },
        computed: {
            tracksCount() {
                return this.$store.state.addedTracks.length
            }
        }
    }
</script>

<style scoped>
    .header-back {
        float: right;
    }

    .added-tracks-count {
        text-align: right;
        font-weight: 500;
    }

    .form {
        margin-left: 40px;
    }
</style>