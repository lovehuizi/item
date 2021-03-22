<template>
  <div>
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="8" :offset='10' style="margin-top: 20px;">
            <div class="grid-content ">
              <!-- 时间范围 -->
              <div class="block">
                <!-- <span class="demonstration">带快捷选项</span> -->
                <el-date-picker v-model="value2" type="daterange" size="large" align="center" unlink-panels
                  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
                </el-date-picker>

                <el-button type="primary" size="medium" @click="btn">
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
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="19.9" :offset="2">
            <div class="grid-content bg-purple-dark">

              <!-- 表格 -->  // currpage 当前页  pagesize 每页显示条数
 
              <el-table :data="tableData.slice((currpage - 1) * pagesize, currpage * pagesize)" style="width: 100%"
                border stripe height=580 slot="empty" :header-cell-style="{background:'#F5F4F7'}">
                <el-table-column label="用户名称" width="300" align="center">
                  <template slot-scope="scope">
                    <div style="margin-left: 10px;">{{ scope.row.addressInfo.userName }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="用户电话" width="300" align="center">
                  <template slot-scope="scope">
                    <div style="margin-left: 10px;">{{ scope.row.addressInfo.tel }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="用户地址" width="300" align="center">
                  <template slot-scope="scope">
                    <div style="margin-left: 10px;">{{ scope.row.addressInfo.streetName }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="消费金额" width="300" align="center">
                  <template slot-scope="scope">
                    <div style="margin-left: 10px;">{{ scope.row.orderTotal }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="下单时间" width="300" align="center">
                  <template slot-scope="scope">
                    <div style="margin-left: 10px;">{{ scope.row.createDate }}</div>
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
                :current-page="currpage" :page-sizes="[1, 3, 5, 8,11]" :page-size="pagesize"
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
        tableData: [],
        currpage: 1, // 默认当前页
        pagesize: 11, // 默认每页条数
        total: 10, //  共有几条数据
        value2: '',
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      }
    },
    methods: {
      handleSizeChange(val) { // 每页条数 
        console.log(`每页 ${val} 条`);
        this.pagesize = val;
      },
      handleCurrentChange(val) { //  当前页
        console.log(`当前页: ${val}`);
        this.currpage = val;
      },
      btn() {
        var oldTime = new Date(this.value2[0]).getTime();
        var newTime = new Date(this.value2[1]).getTime();

        axios.get('/users/getLiusui',{
          params:{
            oldTime:oldTime,
            newTime:newTime
          }
        }).then(res => {
          if (res.data.status == '0') {
            var arr = res.data.result.flat(Infinity);
            console.log('%c 🥟 arr: ', 'font-size:20px;background-color: #2EAFB0;color:#fff;', arr);
            this.tableData = arr;
             this.total = arr.length;
          }
        })

      },





    },
    mounted() {
    },



  }

</script>

<style>
  p {
    font-size: 16px;
    width: 100%;
    height: 100%;
  }

  .el-date-editor .el-range-separator {
    padding: 0 5px;
    line-height: 32px;
    width: 8%;
    color: #303133;
  }

  .el-col-offset-8 {
    margin-left: 35.33333%;
  }

  .el-col-offset-10 {
    margin-left: 38.66667%;
  }

</style>
