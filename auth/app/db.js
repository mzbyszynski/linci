import { Pool } from "pg";

const pool = new Pool();

const getUserSql = `
    select 
        id,
        name,
        email 
    from user 
    where email = lower(trim($1))
    and password = crypt($2, trim(password))`;

export const getUser = async ({ email, password }) => {
  const { rows } = await pool.query(getUserSql, [email, password]);
  if (rows.length > 0) {
    return rows[0];
  }

  return null;
};

const insertUserSql = `
    insert into user
        (name, email, password)
    values 
        (
            trim($1), 
            lower(trim($2)), 
            crypt($3, gen_salt('bf'))
        )
    returning id, email, name`;

export const createUser = async ({ email, name, password }) => {
  const { rows } = await pool.query(insertUserSql, [name, email, password]);
  return rows[0];
};
