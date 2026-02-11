import requests
import json

# Configuration mirror from config.js
CONFIG = {
    'bitcoin': 'https://mempool.space/api/v1/fees/recommended',
    'ethereum': [
        'https://eth.llamarpc.com',
        'https://cloudflare-eth.com',
        'https://rpc.ankr.com/eth'
    ]
}

def test_bitcoin():
    print(f"Testing Bitcoin API: {CONFIG['bitcoin']}")
    try:
        response = requests.get(CONFIG['bitcoin'], timeout=5)
        response.raise_for_status()
        data = response.json()
        print(f"✅ Success. Data: {json.dumps(data, indent=2)}")
        
        required_keys = ['fastestFee', 'halfHourFee', 'hourFee']
        if all(k in data for k in required_keys):
            print("✅ Data structure valid.")
        else:
            print("❌ Data structure mismatch.")
    except Exception as e:
        print(f"❌ Failed: {e}")

def test_ethereum():
    print("\nTesting Ethereum RPCs...")
    payload = {
        "jsonrpc": "2.0",
        "method": "eth_gasPrice",
        "params": [],
        "id": 1
    }
    
    for url in CONFIG['ethereum']:
        print(f"Testing {url}...")
        try:
            response = requests.post(url, json=payload, timeout=5)
            if response.status_code == 200:
                data = response.json()
                if 'result' in data:
                    gas_hex = data['result']
                    gas_gwei = int(gas_hex, 16) / 1e9
                    print(f"✅ Success. Gas Price: {gas_gwei} Gwei")
                    return # Stop after first success
                else:
                    print(f"⚠️  Invalid response format: {data}")
            else:
                print(f"⚠️  HTTP Error: {response.status_code}")
        except Exception as e:
            print(f"⚠️  Connection failed: {e}")
            
    print("❌ All Ethereum RPCs failed.")

if __name__ == "__main__":
    print("--- API Verification Script ---\n")
    test_bitcoin()
    test_ethereum()
    print("\n--- End Verification ---")
