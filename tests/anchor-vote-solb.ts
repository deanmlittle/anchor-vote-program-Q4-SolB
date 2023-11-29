import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorVoteSolb } from "../target/types/anchor_vote_solb";
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
// import { sha256 } from "@coral-xyz/anchor/dist/cjs/utils";
import { createHash } from "crypto";

describe("anchor-vote-solb", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const provider = anchor.getProvider();

  const program = anchor.workspace.AnchorVoteSolb as Program<AnchorVoteSolb>;

  const signer = Keypair.generate();

  const site = "google.com";

  const hash = createHash('sha256');

  hash.update(Buffer.from(site));

  const seeds = [hash.digest()];

  const vote = PublicKey.findProgramAddressSync(seeds, program.programId)[0];

  const confirm = async(signature: string) => {
    const block = await provider.connection.getLatestBlockhash();
    await provider.connection.confirmTransaction({
      signature,
      ...block
    })
    return signature
  }

  const log = async(signature: string) => {
    console.log(`https://explorer.solana.com/transaction/${signature}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`);
    return signature
  }

  it("Airdrop", async () => {
    await provider.connection.requestAirdrop(signer.publicKey, LAMPORTS_PER_SOL * 10)
    .then(confirm).then(log);
  });

  xit("Initialize", async () => {
    // Add your test here.
    const tx = await program.methods
      .initialize(site)
      .accounts({
        signer: signer.publicKey,
        vote
      })
      .signers([signer])
      .rpc()
      .then(confirm).then(log);
  });

  xit("Upvote", async () => {
    // Add your test here.
    const tx = await program.methods
      .upvote(site)
      .accounts({
        signer: signer.publicKey,
        vote
      })
      .signers([signer])
      .rpc()
      .then(confirm).then(log);

    const tx2 = await program.methods
      .upvote(site)
      .accounts({
        signer: signer.publicKey,
        vote
      })
      .signers([signer])
      .rpc()
      .then(confirm).then(log);

    const tx3 = await program.methods
      .upvote(site)
      .accounts({
        signer: signer.publicKey,
        vote
      })
      .signers([signer])
      .rpc()
      .then(confirm).then(log);
  })


  it("Downvote", async () => {
    // Add your test here.
    const tx = await program.methods
      .downvote(site)
      .accounts({
        signer: signer.publicKey,
        vote
      })
      .signers([signer])
      .rpc()
      .then(confirm).then(log);
  })
});
