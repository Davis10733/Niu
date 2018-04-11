pragma solidity ^0.4.9;
import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";

contract Writer is Ownable {

  bytes32 public supportsInterface;
  function Writer(string name) public {
    supportsInterface = keccak256(name);
  }

  // mapping to storage address => writer's data
  mapping(address => WriterStruct) writers;
  address[] writerAddresses;

  // store ipfs hashes and extra data
  struct WriterStruct {
    mapping(bytes32 => ExtraData) articles;
    bytes32[] articleHashes;
    address writerAddress;
  }

  // store extra data of specific ipfs hash
  struct ExtraData {
    mapping(bytes32 => bytes) value;
    bytes32[] keys;
    bytes32 articleHash;
  }

  function isWriter(address senderAddress) 
    public
    view
    returns(bool success)
  {
    if (writerAddresses.length == 0) {
      return false;
    }
    if (writers[senderAddress].writerAddress == 0) {
      return false;
    }
    return true;
  }

  function insertWriter(address writerAddress) 
    public
    onlyOwner
    returns(bool success)
  {
    if (isWriter(writerAddress)) {
      return false;
    }

    writerAddresses.push(writerAddress);
    writers[writerAddress].writerAddress = writerAddress;

    return true;
  }

  event GetAllPost(
    bytes32[] ipfsHashes,
    address writerAddress
  );
  function getAllPosts(address writerAddress)
    view
    public 
  {
    if (!isWriter(writerAddress)) {
      revert();
    }

    GetAllPost(writers[writerAddress].articleHashes, writerAddress);
  }

  function insertPost(bytes32 ipfsHash, address writerAddress)
    public
    onlyOwner
  {
    if (!isWriter(writerAddress)) {
      revert();
    }

    writers[writerAddress].articleHashes.push(ipfsHash);
    writers[writerAddress].articles[ipfsHash].articleHash = ipfsHash;
  }
}
