# AWS Bedrock Setup Guide for Solina AI

Since you have AWS credits, using AWS Bedrock is the perfect solution! Follow these steps:

## Step 1: Install AWS SDK

Run this in your backend folder:
```bash
cd backend
npm install @aws-sdk/client-bedrock-runtime
```

## Step 2: Set Up AWS Bedrock

### 2.1 Enable Model Access in AWS Console

1. Go to AWS Console: https://console.aws.amazon.com/
2. Search for "Bedrock" in the services
3. Click on **"Bedrock"** service
4. In the left sidebar, click **"Model access"**
5. Click **"Enable specific models"** or **"Modify model access"**
6. Select **"Claude 3 Sonnet"** by Anthropic (recommended for your use case)
7. Click **"Save changes"**
8. Wait 1-2 minutes for access to be granted

### 2.2 Create IAM User for API Access

1. Go to **IAM** service in AWS Console
2. Click **"Users"** → **"Create user"**
3. Name: `solina-ai-bedrock-user`
4. Click **"Next"**
5. Select **"Attach policies directly"**
6. Search for and select: **`AmazonBedrockFullAccess`**
7. Click **"Next"** → **"Create user"**

### 2.3 Create Access Keys

1. Click on the user you just created
2. Go to **"Security credentials"** tab
3. Scroll to **"Access keys"** section
4. Click **"Create access key"**
5. Select **"Application running outside AWS"**
6. Click **"Next"** → **"Create access key"**
7. **IMPORTANT**: Save both:
   - Access Key ID
   - Secret Access Key

## Step 3: Configure Backend

Add these to your `backend/.env` file:

```env
# AWS Bedrock Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
```

## Step 4: Test It!

1. Start your backend:
```bash
cd backend
npm run dev
```

2. Start your frontend:
```bash
cd frontend
npm run dev
```

3. Go to the chat page and send a message!

## Available Models on Bedrock

You can use different models by changing the `modelId` in `aiService.ts`:

- **Claude 3 Sonnet**: `anthropic.claude-3-sonnet-20240229-v1:0` (Recommended - balanced)
- **Claude 3 Haiku**: `anthropic.claude-3-haiku-20240307-v1:0` (Faster, cheaper)
- **Claude 3 Opus**: `anthropic.claude-3-opus-20240229-v1:0` (Most capable, expensive)
- **Llama 3 70B**: `meta.llama3-70b-instruct-v1:0` (Open source, good)
- **Mistral Large**: `mistral.mistral-large-2402-v1:0` (Fast, multilingual)

## Cost Estimation (with AWS Credits)

Claude 3 Sonnet pricing:
- Input: ~$3 per 1M tokens
- Output: ~$15 per 1M tokens

For casual use (100 conversations/day with ~500 tokens each):
- **~$1-2/day** which your AWS credits will cover!

## Troubleshooting

### Error: "Access Denied"
- Make sure you enabled Claude 3 model access in Bedrock console
- Check IAM user has `AmazonBedrockFullAccess` policy

### Error: "Region not supported"
- Change `AWS_REGION` to a supported region:
  - `us-east-1` (N. Virginia)
  - `us-west-2` (Oregon)
  - `eu-west-3` (Paris)

### Model not found
- Verify model access is enabled in Bedrock console
- Make sure you're in the correct region

## Alternative: Free Options Without AWS

If you want to try other free options first:

### 1. Google Gemini (Free Tier)
```bash
npm install @google/generative-ai
```
- Get API key: https://makersuite.google.com/app/apikey
- Free: 60 requests/minute

### 2. Groq (Free Fast Inference)
```bash
npm install groq-sdk
```
- Get API key: https://console.groq.com/
- Uses Llama 3 and Mixtral models
- Free tier: Very generous

### 3. Hugging Face (Free)
- API: https://huggingface.co/settings/tokens
- Many free models available

Let me know which option you'd like to use and I can help you integrate it!
