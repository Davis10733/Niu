pragma solidity ^0.4.4;
import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Writer.sol";
import "./Post.sol";

contract InsiderManager is Ownable {
  event NewInsiderManagerCreated (
    address newInsiderManagerContractAddress,
    address newInsiderManagerAddress
  );
  function InsiderManager() public {
    NewInsiderManagerCreated(address(this), msg.sender);
  }

  Writer writers = new Writer('insider-writers');
  Post posts = new Post('insider-posts');

  event NewWriterCreated (
    address newWriterAddress
  );
  function createNewWriter(address newWriterAddress) 
    public 
    returns(bool success)
  {
    writers.insertWriter(newWriterAddress);
    NewWriterCreated(address(this));
    return true;
  }

  event NewPostCreated (
    bytes32 ipfsHash,
    address writerAddress
  );
  function createNewPost(bytes32 ipfsHash)
    public
    onlyWriter
    returns(bool success)
  {
    writers.insertPost(ipfsHash, msg.sender);
    posts.insertPost(ipfsHash);
    NewPostCreated(ipfsHash, msg.sender);
    return true;
  }

  function createNewPostByManager(bytes32 ipfsHash, address writerAddress)
    public 
    onlyOwner
    returns(bool success)
  {
    if (!isWriter(writerAddress)) {
      revert();
    }
    writers.insertPost(ipfsHash, writerAddress);
    posts.insertPost(ipfsHash);
    NewPostCreated(ipfsHash, writerAddress);

    return true;
  }

  function getAllPosts(address writerAddress) 
    public
    view
    returns(bool success)
  {
    writers.getAllPosts(writerAddress);
    return true;
  }

  modifier onlyWriter() {
    require(isWriter(msg.sender));
    _;
  }

  function isValidArticle(bytes32 ipfsHash)
    public
    view
    returns(bool result)
  {
    return posts.isValidArticle(ipfsHash);
  }

  function isWriter(address sender)
    public
    view
    returns(bool result)
  {
    return writers.isWriter(sender);
  }
}
