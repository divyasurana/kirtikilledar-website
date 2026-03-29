#!/usr/bin/env python3
"""
Admin Password Reset Script for Kirti Portfolio
This script resets the admin password in MongoDB Atlas
"""

import asyncio
import bcrypt
from motor.motor_asyncio import AsyncIOMotorClient
import sys

# MongoDB Atlas connection
MONGODB_URI = "mongodb+srv://devsurana:Live%401412Life@cluster0.ncjiiyi.mongodb.net/kirti_portfolio?retryWrites=true&w=majority&appName=Cluster0"

async def reset_admin_password(new_password):
    """Reset admin password in MongoDB Atlas"""
    
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client['kirti_portfolio']
    
    print("🔐 Resetting admin password...\n")
    
    # Hash the new password
    password_hash = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    # Update admin user
    result = await db.admin_users.update_one(
        {"username": "admin"},
        {"$set": {"password_hash": password_hash}}
    )
    
    if result.modified_count > 0:
        print("✅ Password reset successful!")
        print(f"   Username: admin")
        print(f"   New Password: {new_password}")
        print()
        
        # Verify the new password
        admin = await db.admin_users.find_one({"username": "admin"}, {"_id": 0})
        is_valid = bcrypt.checkpw(new_password.encode('utf-8'), admin['password_hash'].encode('utf-8'))
        
        if is_valid:
            print("✅ Password verified - you can now login!")
        else:
            print("❌ Verification failed - something went wrong")
    else:
        print("❌ No admin user found to update")
    
    client.close()

async def show_current_credentials():
    """Show current admin credentials (test password)"""
    
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client['kirti_portfolio']
    
    admin = await db.admin_users.find_one({"username": "admin"}, {"_id": 0})
    
    if admin:
        print("Current admin user:")
        print(f"  Username: {admin.get('username')}")
        print(f"  ID: {admin.get('id')}")
        
        # Test known password
        test_password = "Kirti2024!"
        is_valid = bcrypt.checkpw(test_password.encode('utf-8'), admin['password_hash'].encode('utf-8'))
        
        if is_valid:
            print(f"  ✅ Current Password: {test_password}")
        else:
            print(f"  ⚠️  Password is NOT the default")
    else:
        print("❌ No admin user found")
    
    client.close()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        if sys.argv[1] == "--reset":
            if len(sys.argv) < 3:
                print("Usage: python reset_admin.py --reset <new_password>")
                sys.exit(1)
            new_password = sys.argv[2]
            asyncio.run(reset_admin_password(new_password))
        elif sys.argv[1] == "--show":
            asyncio.run(show_current_credentials())
        else:
            print("Usage:")
            print("  python reset_admin.py --show              # Show current credentials")
            print("  python reset_admin.py --reset <password>  # Reset password")
    else:
        print("Usage:")
        print("  python reset_admin.py --show              # Show current credentials")
        print("  python reset_admin.py --reset <password>  # Reset password")
