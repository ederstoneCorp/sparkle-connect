package com.example.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface AccountDao {

    @Query("SELECT * FROM student_accounts ORDER BY createdAt DESC")
    fun getAllAccountsFlow(): Flow<List<AccountEntity>>

    @Query("SELECT * FROM student_accounts ORDER BY createdAt DESC")
    suspend fun getAllAccounts(): List<AccountEntity>

    @Query("SELECT * FROM student_accounts WHERE LOWER(email) = LOWER(:email) LIMIT 1")
    suspend fun findByEmail(email: String): AccountEntity?

    @Query("SELECT * FROM student_accounts WHERE LOWER(username) = LOWER(:username) LIMIT 1")
    suspend fun findByUsername(username: String): AccountEntity?

    @Query("SELECT * FROM student_accounts WHERE LOWER(googleEmail) = LOWER(:googleEmail) LIMIT 1")
    suspend fun findByGoogleEmail(googleEmail: String): AccountEntity?

    @Query("SELECT * FROM student_accounts WHERE authProvider = :provider AND LOWER(socialHandle) = LOWER(:handle) LIMIT 1")
    suspend fun findBySocial(provider: String, handle: String): AccountEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAccount(account: AccountEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(accounts: List<AccountEntity>)

    @Query("DELETE FROM student_accounts WHERE id = :id")
    suspend fun deleteAccountById(id: String)
}
