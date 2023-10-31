import mysql from 'mysql2'
import dotenv from 'dotenv'
import util from 'util'
import e from 'express'

dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()


export async function delete_data(table, field, value) {
    try {
        const query = util.format(`DELETE FROM %s WHERE %s = '%s'`, table, field, value)
        const [result] = await pool.query(query)
        return result[0]
    } catch (error) {
        console.error('Error fetching data', error)
        throw error
    }
}

export async function delete_data_conditions(table,fields,data){
    try{
        if(fields.length === data.length){
            let final = []
    
            for(var i = 0 ; i<fields.length;i++){
                final.push(`${fields[i]} = '${data[i]}'`)
            }
            const final_f = final.join(" AND ")
            const query = util.format(`DELETE FROM %s WHERE %s`, table, final_f)
            const [result] = await pool.query(query)
            return result
        }   
        else{
            return 'Fields and data are not the same length'
        }
        
        
    }catch(error){
        console.error('Error fetching data',error)
        throw error
    }
}



export async function get_single_data(table, field, value) {
    try {
        const query = util.format(`SELECT * FROM %s WHERE %s = '%s'`, table, field, value)
        const [result] = await pool.query(query)
        return result[0]
    } catch (error) {
        console.error('Error fetching data', error)
        throw error
    }
}

export async function get_multiple_data(table, field, value) {
    try {
        const query = util.format(`SELECT * FROM %s WHERE %s = '%s'`, table, field, value)
        const [result] = await pool.query(query)
        return result
    } catch (error) {
        console.error('Error fetching data', error)
        throw error
    }
}

export async function get_all_data(table) {
    try {
        const query = util.format('SELECT * FROM %s', table)
        const [result] = await pool.query(query)
        return result
    } catch (error) {
        console.error('Erorr fetching data', error)
        throw error
    }
}

export async function get_single_data_conditions(table,fields,data){
    try{
        if(fields.length === data.length){
            let final = []
    
            for(var i = 0 ; i<fields.length;i++){
                final.push(`${fields[i]} = '${data[i]}'`)
            }
            const final_f = final.join(" AND ")
            const query = util.format(`SELECT * FROM %s WHERE %s`, table, final_f)
            const [result] = await pool.query(query)
            return result[0]
        }   
        else{
            return 'Fields and data are not the same length'
        }
        
        
    }catch(error){
        console.error('Error fetching data',error)
        throw error
    }
}
export async function get_multiple_data_conditions(table,fields,data){
    try{
        if(fields.length === data.length){
            let final = []
    
            for(var i = 0 ; i<fields.length;i++){
                final.push(`${fields[i]} = '${data[i]}'`)
            }
            const final_f = final.join(" AND ")
            const query = util.format(`SELECT * FROM %s WHERE %s`, table, final_f)
            const [result] = await pool.query(query)
            return result
        }   
        else{
            return 'Fields and data are not the same length'
        }
        
        
    }catch(error){
        console.error('Error fetching data',error)
        throw error
    }
}
export async function get_active_data(table,fields,data){
    try{
        if(fields.length === data.length){
            let final = []
    
            for(var i = 0 ; i<fields.length;i++){
                final.push(`${fields[i]} = '${data[i]}'`)
            }
            const final_f = final.join(" OR ")
            const query = util.format(`SELECT * FROM %s WHERE %s`, table, final_f)
            const [result] = await pool.query(query)
            return result
        }   
        else{
            return 'Fields and data are not the same length'
        }
        
        
    }catch(error){
        console.error('Error fetching data',error)
        throw error
    }
}

export async function insert_data(table, fields, data) {
  try {
    const field_f = fields.join(",");
    const placeholders = data.map(() => '?').join(',');
    const query = util.format(`INSERT INTO %s (%s) VALUES(${placeholders})`, table, field_f);

    // Note: Assuming data is an array of values in the same order as fields
    const [result] = await pool.query(query, data);
    return result.insertId;
  } catch (error) {
    console.error('Error inserting data', error);
    throw error;
  }
}

export async function create_realtor_notification(rltr_id, description) {
    try {
        const query = util.format("INSERT INTO realtor_notification (rltr_id, notification_desc, notification_status, created_at) VALUES (?, ?, 'unread', NOW())");
        const [result] = await pool.query(query, [rltr_id, description]);
        return result.insertId;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
export async function create_pitiquer_notification(ptqr_id, description) {
    try {
        const query = util.format("INSERT INTO pitiquer_notification (ptqr_id, notification_desc, notification_status, created_at) VALUES (?, ?, 'unread', NOW())");
        const [result] = await pool.query(query, [ptqr_id, description]);
        return result.insertId;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function get_total_unread_notification(table, id){
    try{
        var idLabel;
        if(table == "pitiquer_notification"){idLabel = "ptqr_id"}
        if(table == "realtor_notification"){idLabel = "rltr_id"}
        const query = `SELECT IFNULL(COUNT(*),0) as unreadNotifications FROM ${table} WHERE ${idLabel} = ${id} AND notification_status = 'unread'`
        const [result] = await pool.query(query, [idLabel, id])
        return result[0]
    }catch(error){
        console.error(error);
        throw error;
    }
}
export async function get_notifications(table, id) {
    try {
        let idLabel;
        if (table === "pitiquer_notification") {
            idLabel = "ptqr_id";
        }
        if (table === "realtor_notification") {
            idLabel = "rltr_id";
        }
        
        const query = `SELECT * FROM ${table} WHERE ${idLabel} = ? ORDER BY created_at DESC`;
        const [result] = await pool.query(query, [id]);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
export async function update_data(table, fields, data) {
    try {
      if (fields.length === data.length) {
        const fieldUpdates = fields.map(field => `${field} = ?`).join(', ');
        const query = util.format(
          `UPDATE %s SET %s WHERE %s = %s`,
          table,
          fieldUpdates,
          fields[0],
          data[0]
        );
  
        const [result] = await pool.query(query, data);
        return result;
      }
    } catch (error) {
      console.error('Error updating data', error);
      throw error;
    }
  }


  export async function get_min_price(ptqr_id){
    try{
  
            const query = util.format(`SELECT MIN(pkg_min_price) as min_price FROM pitique.package WHERE ptqr_id = %s;`, ptqr_id)
            const [result] = await pool.query(query)
            return result[0]
        
    }catch(error){
        console.error('Error fetching data',error)
        throw error
    }
  }

  export async function getRating(ptqr_id){
    try{
  
            const query = util.format(`SELECT IFNULL(AVG(pfdbk_rtng),0) as rating, COUNT(*) AS totalratings FROM pitique.pitiquer_feedback WHERE ptqr_id = %s;`, ptqr_id)
            const [result] = await pool.query(query)
            return result[0]
        
    }catch(error){
        console.error('Error fetching data',error)
        throw error
    }
  }

// export async function update_data(table,fields,data){
//     try{
//         if(fields.length === data.length){
//             var fields_f = []
//             for(var x=0;x<fields.length;x++){
//                 fields_f.push(`${fields[x]}='${data[x]}'`)
//             }
//             var final = fields_f.join(",")
//             const query = util.format(`UPDATE %s SET %s WHERE %s = '%s'`,table,final,fields[0], data[0])
//             const [result] = await pool.query(query)
//             return result[0]
//         }
//     }catch(error){
//         console.error('Error updating data', error)
//         throw error
//     }
// }



