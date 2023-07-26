import pg from "pg";

const pool = new pg.Pool();

const getPlayerSql = `
    select 
        id,
        name,
        email 
    from player 
    where email = lower(trim($1))
    and password = crypt($2, trim(password))`;

export const getPlayer = async ({ email, password }) => {
  const { rows } = await pool.query(getPlayerSql, [email, password]);
  if (rows && rows.length > 0) {
    return rows[0];
  }

  return null;
};

const insertPlayerSql = `
    insert into player
        (name, email, password)
    values 
        (
            trim($1), 
            lower(trim($2)), 
            crypt($3, gen_salt('bf'))
        )
    returning id, email, name`;

export const createPlayer = async ({ email, name, password }) => {
  const { rows } = await pool.query(insertPlayerSql, [name, email, password]);
  return rows[0];
};
