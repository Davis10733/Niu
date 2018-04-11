pragma solidity ^0.4.4;
import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Writer.sol";

contract WriterManager is Ownable {
  event NewWriterManagerCreated (
    address newWriterManagerContractAddress,
    address newWriterManagerAddress
  );
  function WriterManager() public {
    NewWriterManagerCreated(address(this), msg.sender);
  }

  Writer writers = new Writer('writers');
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
    NewPostCreated(ipfsHash, msg.sender);
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

  function isWriter(address sender)
    public
    view
    returns(bool result)
  {
    return writers.isWriter(sender);
  }
}
