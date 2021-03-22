<template>
  <div>
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="8" :offset='8' style="margin-top: 20px;">
            <div class="grid-content ">
              <div style="margin-left: 200px;">
                <!-- <input v-model="search" @change='booksee_data' placeholder="请输入商品名称进行查询" class="searchbook"></input> -->
                <el-input style="margin-left: -147px;height: 49px;width: 316px;" v-model="search" @change='booksee_data'
                  placeholder="请输入内容"></el-input>
                <el-button type="primary" size="medium" @click="searchbook">
                  搜索
                </el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-main style="margin-top: 15px;">
        <el-row>
          <el-col :span="1" :offset='22'>
            <!-- 左侧抽屉添加商品 -->
            <div class="grid-conten">
              <el-button @click="book_add" type="primary" style="margin-left: 10px;">添加商品</el-button>
              <el-drawer ref='close_mask' title="我是标题" :visible.sync="drawer" :with-header="false" direction="ltr"
                size="45%" close-on-press-escape @closed='chang_title'>
                <el-container>
                  <el-header>
                    <h2 style="text-align: center;margin-top: 10px;">{{cz_book}}</h2>
                  </el-header>
                  <el-main>
                    <el-row>
                      <el-col :span="20" :offset='2'>
                        <div class="grid-content" style="height: 800px;">
                          <el-input placeholder="请输入商品名" v-model="sp_name" style="margin-bottom: 15px;">
                            <template slot="prepend">商品名</template>
                          </el-input>
                          <el-input placeholder="请输入商品数量" v-model="sp_num" style="margin-bottom: 15px;">
                            <template slot="prepend">数量</template>
                          </el-input>
                          <el-input placeholder="请输入商品价格" v-model="sp_price" style="margin-bottom: 15px;">
                            <template slot="prepend">价格</template>
                            <template slot="append">元</template>
                          </el-input>




                          <h3>上传商品图片:</h3>
                          <!-- <el-upload class="upload-demo" drag action="/goods/addItem" :on-success="uploadSuccess"
                            :before-upload="uploadBefore" accept="image/*" multiple>
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将商品图片拖到此处，或<em>点击上传</em></div>
                            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                          </el-upload> -->

                          <!-- <el-upload  drag	class="upload-demo" action="/goods/upload" :on-success="uploadSuccess"
                            :before-upload="uploadBefore" accept="image/*">
                            <el-button size="mini" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传图片，且不超过5000kb</div>
                          </el-upload> -->

                          <div class="power">
                            <input @change="uploadPhoto($event)" type="file" class="kyc-passin" />
                            <img :src="base64" alt />
                            <!-- // 这种可以打开相机或文件，"jpg,png,gif"这种打开只能上传特定文件且没有相机 -->
                          </div>
                          <el-row>
                            <el-col :span="8" :offset="9">
                              <div class="grid-content" style="margin-top: 35px;">
                                <el-button :type="book_btn" @click='data_up'>{{book_tx}}</el-button>
                                <el-button type="danger" style="margin-left: 30px;" @click="clear">重置</el-button>
                              </div>
                            </el-col>
                          </el-row>
                        </div>
                      </el-col>
                    </el-row>
                  </el-main>
                </el-container>
              </el-drawer>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple-dark">


              <el-table :data="tableData.slice((currpage - 1) * pagesize, currpage * pagesize)" style="width: 100%"
                border height=605 slot="empty" :header-cell-style="{background:'#F5F4F7'}">
                <el-table-column label="商品图片" width="280" align="center">
                  <template slot-scope="scope">
                    <!-- <div style="margin-left: 10px;height:80px">{{ scope.row.productImg }}</div> -->
                    <!-- <img :src="'../../static/'+scope.row.productImg " alt="" width="80px" height="80px"> -->
                    <img :src="scope.row.productImg " alt="" width="80px" height="80px">

                  </template>
                </el-table-column>
                <el-table-column label="商品名称" width="649" align="center" class-name='color'>
                  <template slot-scope="scope">
                    <span style="margin-left: 10px;font-size:24PX">{{ scope.row.productName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="商品价格" width="649" align="center">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px;font-size:24PX">{{ scope.row.salePrice }}</span>
                  </template>
                </el-table-column>

                <el-table-column label="商品数量" width="100" align="center" :class-name='state_color'>
                  <template slot-scope="scope">
                    <span style="margin-left: 10px;font-size:24PX">{{ scope.row.productNum }}</span>
                  </template>
                </el-table-column>


                <el-table-column label="操作" align="center" width="200">
                  <template slot-scope="scope">
                    <el-button size="mini" type="success" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" :offset='9' style="margin-top: 20px;">
            <!-- 分页 -->
            <div>
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="currpage" :page-sizes="[1, 3, 5, 8,10]" :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total" background>
              </el-pagination>
            </div>
          </el-col>
        </el-row>

      </el-main>
    </el-container>
  </div>
</template>







<script>
  import axios from 'axios' // 导入axios
  export default {
    data() {
      return {

      }
    },
    components: {

    },
    data() {
      return {
        tableData: [],
        currpage: 1, // 默认当前页
        pagesize: 5, // 默认每页条数
        total: 10, //  共有几条数据
        search: '',
        drawer: false, // 弹框
        cz_book: '添加商品',
        sp_name: '', // 表单信息
        sp_num: '', // 表单信息
        sp_price: '', // 表单信息
        book_tx: '添加',
        book_btn: 'primary',
        state_color: 'zt',
        did: '',
        formInline: {
          img: ''
        },
        base64: '',
        sp_img: ''
      }
    },
    methods: {
      uploadPhoto(e) {
        // 利用fileReader对象获取file
        var file = e.target.files[0];
        var filesize = file.size;
        var filename = file.name;

        // 2,621,440   2M
        if (filesize > 2101440) {
          // 图片大于2MB
        }
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          // 读取到的图片base64 数据编码 将此编码字符串传给后台即可
          var imgcode = e.target.result;
          // let that=this;
          this.formInline.img = imgcode;

          this.sp_img = imgcode;
          // 
          // this.$http.post('/uploads/transfer',{
          //       "filename": filename,
          //       "filesize": filesize,
          //       "base64": imgcode
          //     }).then(res=>{
          //       this.base64=res.data.base64
          //   
          //   
          // })
        }
      },
      uploadSuccess(res) {
        this.uploadDataForm.url = res.data.path;
      },
      uploadBefore(file) {
        let limitMax = 5000 * 1024;
        if (file.size > limitMax) {
          this.$messageTips("大小超出限制");
          return false;
        }
      },

      handleEdit(index, row) {

        this.drawer = true;
        this.cz_book = '修改商品';
        this.book_tx = '修改'
        this.book_btn = 'success';

        this.sp_name = row.productName;
        this.sp_price = row.salePrice;
        this.sp_num = row.productNum;
        this.did = row.productId;



      },
      book_add() {
        this.book_tx = '添加';
        this.drawer = true;
        this.book_btn = 'primary';
        this.sp_name = row.name;
        this.sp_price = row.price;
        this.sp_num = row.num;
      },
      data_up() { // 添加数据
        //  // 通过书名去后台查询 没有就添加 有就 更新数据

        if (this.sp_name == '') {
          this.$message({
            message: '请输入商品名称',
            type: 'warning'
          });
          return false;
        }
        if (this.sp_price == '') {
          this.$message({
            message: '请输入商品价格',
            type: 'warning'
          });
          return false;

        }

        if (this.sp_num == '') {
          this.$message({
            message: '请输入商品数量',
            type: 'warning'
          });
          return false;

        }

        // 修改

        axios.get('/goods/updateItem', {
          params: {
            id: this.did,
            name: this.sp_name,
            num: this.sp_num,
            price: this.sp_price,
          }
        }).then(res => {
          this.getdata();
          this.$notify({
            title: '成功',
            message: '数据修改成功！',
            type: 'success'
          });

          if (res == '添加成功') {
            this.getdata();

            this.$refs.close_mask.closeDrawer();
          } else {




          }
        })
        this.$refs.close_mask.closeDrawer();
        this.getdata();

        axios.post('/goods/addItem', {

          name: this.sp_name,
          price: this.sp_price,
          num: this.sp_num,
          img: this.sp_img
          // img:'1.png'

        }).then(res => {
          console.log('%c 🥞 res: ', 'font-size:20px;background-color: #7F2B82;color:#fff;', res);

          if (res.data.status == '0') {
            this.getdata();
            this.$refs.close_mask.closeDrawer();
            this.sp_img = '';
            this.$notify({
              title: '成功',
              message: '数据添加成功！',
              type: 'success'
            });
          }

          // this.total = res.length;
          // this.tableData = res;
        })




        this.sp_name = '';
        this.sp_price = '';
        this.sp_num = '';


      },
      chang_title() {
        this.cz_book = '添加商品'
      },
      handleDelete(index, row) { // 删除数据 
        this.$confirm(`是否删除${row.productName}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          // 向后台发送请求删除此数据
          axios.get('/goods/spDel', {
            params: {
              id: row.productId
            }
          }).then(res => {

          })
          this.getdata();

          this.$message({
            type: 'success',
            message: '删除成功!',
            showClose: true,
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
            showClose: true,
          });
        });

      },
      handleSizeChange(val) { // 每页条数 

        this.pagesize = val;
      },
      handleCurrentChange(val) { //  当前页

        this.currpage = val;
      },
      searchbook() { // 查询后台数据  没有输入查询内容就显示全部数据 输入了就查询 没查到就返回一个空数组
        // 
        if (this.search != '') {
          this.tableData = this.tableData.filter(data => !this.search || data.productName.toLowerCase().includes(this
            .search.toLowerCase()))
        }


      },
      booksee_data() {
        if (this.search == '') {
          this.getdata();
        }
      },
      clear() { // 清空表单信息

        this.sp_name = '';
        this.sp_price = '';
        this.sp_num = '';

        this.$notify({
          title: '成功',
          message: '重置成功！',
          type: 'success'
        });
        this.$refs.close_mask.closeDrawer();
      },
      getdata() { // 请求后台接口
        axios.get('/goods/getSpdata').then(res => {

          this.total = res.data.result.length;
          this.tableData = res.data.result;
        })
      },



    },
    mounted() {
      this.getdata();
    },



  }

</script>

<style>
  p {
    font-size: 16px;
    width: 100%;
    height: 100%;
  }

  .one {
    width: 3rem;
    height: 3rem;
  }

  .one img {
    width: 3rem;
    height: 3rem;
  }

</style>
