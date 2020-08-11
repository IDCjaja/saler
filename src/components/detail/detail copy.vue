<template>
  <div>
    <div class="detail_content">
      <el-table :data="tableData" style="width: 100%" height="870" border stripe>
        <el-table-column fixed align="center" prop="saler" label="置业顾问" width="80"></el-table-column>
        <el-table-column align="center" prop="saler_phone" label="置业顾问电话" width="110"></el-table-column>
        <el-table-column align="center" prop="name" label="客户姓名" width="100"></el-table-column>
        <el-table-column align="center" prop="phone" label="客户电话" width="110"></el-table-column>
        <el-table-column align="center" prop="gender" label="性别" width="50"></el-table-column>
        <el-table-column align="center" prop="depict" label="客户描摹" width="250"></el-table-column>
        <el-table-column align="center" prop="source" label="信息来源" width="80"></el-table-column>
        <el-table-column align="center" prop="age" label="年龄" width="80"></el-table-column>
        <el-table-column align="center" prop="pathway" label="来访渠道" width="80"></el-table-column>
        <el-table-column align="center" prop="intention" label="客户意向" width="80"></el-table-column>
        <el-table-column align="center" prop="send_card" label="是否排卡" width="80"></el-table-column>
        <el-table-column align="center" prop="motivation" label="置业目的" width="110"></el-table-column>
        <el-table-column align="center" prop="price" label="意向价格" width="180"></el-table-column>
        <el-table-column align="center" prop="payment" label="付款方式" width="80"></el-table-column>
        <el-table-column align="center" prop="entitlement" label="有无购房资格" width="110"></el-table-column>
        <el-table-column align="center" prop="reason" label="购房资格备注" width="110"></el-table-column>
        <el-table-column align="center" prop="resistance" label="客户主要抗性" width="180"></el-table-column>
        <el-table-column align="center" prop="house_type" label="喜好户型" width="180"></el-table-column>
        <el-table-column align="center" prop="living_area" label="居住区域" width="120"></el-table-column>
        <el-table-column align="center" prop="working_area" label="工作区域" width="220"></el-table-column>
        <el-table-column align="center" prop="estimated_time" label="预计来访时间" width="300"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import api from "@/api/api";

export default {
  data() {
    return {
      tableData: [],
    };
  },
  mounted() {
    let sql = `select * from fdc_form_1_13  ORDER BY created_at DESC limit 10 OFFSET 0`;
    api.getSqlJsonAPI(sql).then((res) => {
      console.log(res);
      this.tableData = res.data;
    });
  },
};
</script>

<style lang="scss" >
.detail_content {
  width: 90%;
  margin: 50px auto;

  /deep/ .el-table .cell {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .el-table th > .cell {
    color: #333;
    font-weight: 700;
  }
}
</style>
