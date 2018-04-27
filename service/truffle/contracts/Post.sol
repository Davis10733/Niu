pragma solidity ^0.4.9;
import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";

contract Post is Ownable {

  bytes32 public supportsInterface;
  function Post(string name) public {
    supportsInterface = keccak256(name);
  }

  bytes32[] articleHashes;
  mapping(bytes32 => bool) articleHashMap;

  event GetAllPost(
    bytes32[] ipfsHashes
  );
  function getAllPosts()
    view
    public 
  {
    GetAllPost(articleHashes);
  }

  function insertPost(bytes32 ipfsHash)
    public
    onlyOwner
  {
    articleHashes.push(ipfsHash);
    articleHashMap[ipfsHash] = true;
  }

  function isValidArticle(bytes32 ipfsHash)
    public
    view
    returns(bool reslut)
  {
    if (articleHashMap[ipfsHash] == true) {
      return true;
    }

    return false;
  }
}
